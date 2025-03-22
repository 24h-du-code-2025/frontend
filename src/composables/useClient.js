
import { computed, ref } from 'vue';

import { generateRandomToken } from "@/js/useful";
import { sendMessage, onMessage } from "@/composables/useWebsocket";

export const clientIsLoading = ref(false);
export const clientToken = ref(null);
export const clientMessages = ref([]);
export const activeQuestion = ref(null);

export const isLogged = computed(() => clientToken.value !== null && clientIsLoading.value === false);

export function getClientToken() {

    let clientTokenStored = localStorage.getItem('clientToken');

    if (!clientTokenStored) {

        clientToken.value = generateRandomToken();

        localStorage.setItem('clientToken', clientToken.value);
    } else {

        clientToken.value = clientTokenStored;
    }

    return clientToken.value;
}

export function getClientMessages() {

    return clientMessages.value;
}

export function sendChat(message) {

    sendMessage('chat', {
        message: message
    });
}

export function listenChats(callback = null) {

    onMessage('update_history', (messages) => {

        clientMessages.value = messages;

        if (typeof callback === 'function') {

            callback(clientMessages.value);
        }
    });
}

// export function listenQuestion(callback = null) {

//     onMessage('ask_question', (question) => {

//         activeQuestion.value = formatQuestion(question);

//         if (typeof callback === 'function') {

//             callback(activeQuestion.value);
//         }
//     });
// }

export function startClient() {

    clientIsLoading.value = true;

    getClientToken();
    listenChats();
    // listenQuestion();

    onMessage('connect', () => {

        clientIsLoading.value = false;
    });
}