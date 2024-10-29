import React from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CContainer, CRow, CCol } from '@coreui/react';

const Subscribe = () => {

  const subscribeUser = () => {
    navigator.serviceWorker.ready.then(function (registration) {
      const vapidPublicKey = 'BP_08ecnW8QMG5Ji2JAYLLL4z5wUces0RRBJ5xHHrKNZ9-2MtkRW_dUWGnIZZ0gTOUQZqtx5lkA-zozkHC_BnQM';
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      }).then(function (subscription) {
        console.log('User is subscribed:', subscription);

        // 구독 정보를 서버에 저장
        fetch('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/alert/save-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
          credentials: 'include'
        }).then(response => {
          return response.json();
        }).then(data => {
          console.log('Subscription saved:', data);
        }).catch(error => {
          console.error('Error saving subscription:', error);
        });
      });
    });
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCard>
            <CCardHeader>
              <h1>테스트중</h1>
            </CCardHeader>
            <CCardBody>
              <p>
                브라우저에서 푸시 알림을 구독하도록 하려면 아래 버튼을 클릭하세요.
              </p>
              <CButton color="primary" onClick={subscribeUser}>
                알림받기
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}


export default Subscribe;
