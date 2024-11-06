/* DOM 로드 이전에 JavaScript 실행 문제가 발생함.
이 문제는 JavaScript가 HTML 요소보다 먼저 로드되거나,
DOM이 아직 완전히 로드되지 않았을 때 발생할 수 있음.
이를 해결하려면 JavaScript 파일이 DOM이 모두 로드된 후에 실행되도록 해야 함.

: DOMContentLoaded 이벤트 사용
=> 이 이벤트를 통해 DOM이 완전히 로드된 후에 JavaScript 코드가 실행되도록 보장할 수 있다.*/

const U = "";
const K = "";


document.addEventListener('DOMContentLoaded', function() {
    // 1. 사용할 DOM 선택하기
    //getElementById, querySelector
    const chatLog = document.getElementById('chat-log'),
        userInput = document.getElementById('user-input'),
        sendButton = document.getElementById('send-button'),
        buttonIcon = document.getElementById('button-icon'),
        info = document.querySelector('.info');

    // 2. 버튼 클릭시 이벤트 추가하기
    // addEventListener
    sendButton.addEventListener('click', sendMessage);

    // 번외) 채팅에 편한 기능 추가하기 : 엔터 누르면 메세지 보내기
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    
    // 3. sendMessage 함수 정의하기
    async function sendMessage() {
        //userInput에 있는 값을 message 변수에 저장하기
        const message = userInput.value.trim();
        // trim() : 앞뒤에 있는 공백 제거하는 함수 (사용자가 의도치 않게 공백만 입력했을 때 메시지를 전송하는 것을 방지)

        if (message === '') {       // message가 비어있다면
            return
        }
        else {                      // message가 비어있지 않다면
            // user의 message를 받아 appendMessage 함수 실행(사용자가 입력한 message를 화면에 추가)
            appendMessage('user', message);
            // userInput.value = '';

            const options = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${K}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        // { role: "system", content: "You are a helpful assistant."},
                        { role: "user", content: message }
                    ],
                    max_tokens: 100,
                }),
            };
            
            try {
                const response = await fetch(U, options);
                const data = await response.json();
                console.log(data);

                appendMessage('bot', data);
                buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
                buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
                // await fetch(API_URL, options)
                //     .then((response) => response.json())
                //     .then((response) => {
                //         console.log(response);
                //         appendMessage('bot', response);
                //         buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
                //         buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
                //     })
            } catch(error) {
                console.error("Error: ", error);
                appendMessage('bot', `Error: ${error}`);
            }

            // // 1초 후 bot이 appendMessage 실행
            // setTimeout(() => {
            //     //api에서 연결 후 수정할거에용
            //     appendMessage('bot', 'Made By Suyeon\n')
            //     buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
            //     buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');      // 사용자&봇의 메세지 전송이 끝나면 아이콘을 원래대로
            // }, 1000);
            // return
        }
    }

    // 4.appendMessage 함수 정의하기
    function appendMessage(sender, message) {   // sender는 user 혹은 bot
        // 현재 화면에 보여지고있는 Info 안보이게하기
        info.style.display = 'none';

        // 버튼의 아이콘 바꿔주기 (로딩 아이콘)
        buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
        buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');     // 사용자&봇이 메세지를 전송할 때에는 로딩 아이콘을 사용한다

        // 메세지를 담을 Node 생성하기
        const chatElement = document.createElement('div');      // 전체 채팅 박스
        const messageElement = document.createElement('div');   // 채팅 텍스트가 들어갈 박스
        const iconElement = document.createElement('div');      // 사용자 또는 봇 아이콘이 들어갈 박스
        const icon = document.createElement('i');               // 아이콘 그 자체

        // class 추가하기 : 거의 구분을 위해서 선언한다고 보면 됨.
        chatElement.classList.add('chat-box');
        iconElement.classList.add('icon');
        messageElement.classList.add(sender);       // 전송자가 사용자인지 봇인지 명시

        // text 추가하기
        messageElement.innerText = message;         // 메시지를 채팅 텍스트에 들어가도록 설정

        // sender에 따라 icon 추가하기
        if(sender === 'user') {     // sender가 사용자일 경우 
            icon.classList.add('fa-regular', 'fa-user');    // 유저 아이콘
            iconElement.setAttribute('id', 'user-icon');    // 아이디를 #user-icon으로 설정
        } else {                    // sender가 봇일 경우
            icon.classList.add('fa-solid', 'fa-robot');     // 봇 아이콘
            iconElement.setAttribute('id', 'bot-icon');     // 아이디를 #bot-icon으로 설정
        }

        // 정의한 Node를 트리에 연결하기
        iconElement.appendChild(icon);                  // 아이콘 박스에 icon 추가
        chatElement.appendChild(iconElement);           // 전체 채팅 박스에 아이콘 박스 추가
        chatElement.appendChild(messageElement);        // 전체 채팅 박스에 채팅 텍스트 박스 추가
        chatLog.appendChild(chatElement);               // #chat-log에 전체 채팅 박스 연결 : 화면에 표시
    }
});