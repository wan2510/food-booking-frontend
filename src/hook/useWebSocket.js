
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const useWebSocket = (userId, onMessageReceived) => {
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
                const notification = JSON.parse(message.body);
                onMessageReceived(notification);
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, [userId, onMessageReceived]);
};

export default useWebSocket;