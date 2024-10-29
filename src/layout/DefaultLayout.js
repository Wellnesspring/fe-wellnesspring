import React, { useEffect } from 'react';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import { useSelector } from 'react-redux';

const DefaultLayout = () => {
  const user = useSelector((state) => state.user);

  const sportAlert = {
    body: '',
    icon: '/logo192.png', // 알림에 표시할 아이콘
    dir: 'ltr', // 텍스트 방향 (ltr: 왼쪽에서 오른쪽)
    tag: 'unique-tag', // 알림 태그 (같은 태그의 알림은 중복되지 않음)
    data: { url: 'http://localhost:3000/Sport/showPlan' }, // 알림과 관련된 데이터 (예: 클릭 시 이동할 URL)
  };

  // 서버에서 alert 데이터를 가져오는 함수 (userId를 파라미터로 사용)
  const fetchAlertData = async (userId) => {
    try {
      const response = await fetch(`https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/sport/alert/plan?userId=${userId}`);
      if (!response.ok) {
        throw new Error('서버 요청 실패');
      }
      const data = await response.json(); // 서버에서 받은 데이터를 JSON으로 파싱
      return data; // 데이터를 반환 (int 값)
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      return null;
    }
  };

  useEffect(() => {
    // 알림 권한 요청 및 알림 기능
    const subscribe = () => {
      if (!("Notification" in window)) {
        alert("알림을 지원하지 않는 브라우저입니다.");
        return;
      }

      if (Notification.permission === "granted") {
        // 시간을 확인하고 알림을 보내는 함수
        const checkTimeAndNotify = async () => {
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();

          if ((hours === 10 || hours === 22) && minutes === 30) {
            if (user && user.userId) { // user 정보가 있는 경우에만 서버 요청
              // 서버로부터 데이터를 가져옴 (userId를 파라미터로 사용)
              const alertValue = await fetchAlertData(user.userId);

              if (alertValue !== null && alertValue > 0) {
                // 알림 메시지 설정
                sportAlert.body = `아직 기록하지 않은 운동이 있습니다. ${alertValue}개의 운동기록을 저장해보세요!`;
                new Notification("운동기록을 저장해주세요!", sportAlert);
              }
              // alertValue가 0일 경우 알림을 보내지 않음
            }
          }
        };

        // 1분마다 시간 체크
        setInterval(checkTimeAndNotify, 60000); // 60000ms = 1분
        return;
      }

      //알림 권한요청이 아직 안 됐을경우에 실행됨
      if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            const checkTimeAndNotify = async () => {
              const now = new Date();
              const hours = now.getHours();
              const minutes = now.getMinutes();

              if ((hours === 10 || hours === 22) && minutes === 30) {
                if (user && user.userId) { // user 정보가 있는 경우에만 서버 요청
                  // 서버로부터 데이터를 가져옴 (userId를 파라미터로 사용)
                  const alertValue = await fetchAlertData(user.userId);

                  if (alertValue !== null && alertValue > 0) {
                    // 알림 메시지 설정
                    sportAlert.body = `${alertValue}개의 운동기록을 저장해보세요!`;
                    new Notification("운동알림!", sportAlert);
                  }
                  // alertValue가 0일 경우 알림을 보내지 않음
                }
              }
            };

            // 1분마다 시간 체크
            setInterval(checkTimeAndNotify, 60000);
          }
        });
      }
    };

    // 컴포넌트가 마운트될 때 알림 권한을 요청하고, 자동으로 알림을 생성합니다.
    subscribe();
  }, [user]); // user가 업데이트 될 때마다 useEffect 실행



  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  );
}

export default DefaultLayout;
