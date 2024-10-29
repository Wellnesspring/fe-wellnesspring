import React, { useEffect, useState } from 'react';
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CListGroup,
  CListGroupItem,
  CButton
} from '@coreui/react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';  // 시간을 비교하기 위해 moment 라이브러리 사용

const AlertPopup = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState([]);

  // Redux에서 user 정보 가져오기
  const user = useSelector(state => state.user);

  const fetchNotifications = async () => {
    if (!user || !user.userId) {
      console.error("User is not logged in or no userId available.");
      return;
    }

    try {
      const response = await axios.get('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/alert/show', {
        params: { userId: user.userId }
      });

      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      alert("알림을 가져오는데 실패했습니다.");
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/alert/read', {
        id: notificationId,
      });

      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, readOrNot: 'READ' }
          : notification
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
      alert("알림 읽음 처리에 실패했습니다.");
    }
  };

  const deleteNotification = async (notificationId) => {
    const isConfirmed = window.confirm("알림을 삭제하시겠습니까?");
    if (isConfirmed) {
      try {
        await axios.delete('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/alert/delete', {
          data: { id: notificationId }, // DELETE 요청에서 data로 전달
        });

        setNotifications(notifications.filter(notification => notification.id !== notificationId));
      } catch (error) {
        console.error('Failed to delete notification:', error);
        alert("알림 삭제에 실패했습니다.");
      }
    }
  };

  // 알림 시간과 현재 시간을 비교하여 몇 일, 몇 시간, 몇 분 전인지 계산하는 함수
  const getTimeDiff = (alertTime) => {
    const now = moment(); // 현재 시간
    const alertMoment = moment(alertTime); // 알림 시간
    const diffInMinutes = alertMoment.diff(now, 'minutes'); // 분 단위 차이 계산

    const duration = moment.duration(diffInMinutes, 'minutes');
    const days = Math.floor(duration.asDays());  // 일 단위 차이
    const hours = Math.floor(duration.hours());  // 시간 차이
    const minutes = Math.floor(duration.minutes());  // 분 차이

    if (days > 0) {
      return `${days}일 ${hours}시간 ${minutes}분`;
    } else if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else {
      return `${minutes}분`;
    }
  };

  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible, user]);

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>Unread Notifications</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CListGroup>
          {notifications.length === 0 ? (
            <CListGroupItem>No new notifications</CListGroupItem>
          ) : (
            notifications.map((notification) => {
              const timeDiff = getTimeDiff(notification.alertTime); // 현재 시간과 알림 시간 비교
              const isPast = timeDiff < 0 ? true : false; // 시간 비교 후 과거 알림인지 여부

              return (
                <CListGroupItem
                  key={notification.id}
                  color={notification.readOrNot === 'READ' ? 'light' : 'warning'}
                >
                  {notification.alertType.message1} 알림 {notification.alertType.message2}

                  {isPast ? (
                    <div>운동 알림: {timeDiff} 전에 운동을 했습니다.</div>
                  ) : (
                    <div>운동 예정: {timeDiff} 후에 운동이 시작됩니다.</div>
                  )}

                  {notification.readOrNot === 'UNREAD' && (
                    <CButton
                      color="primary"
                      size="sm"
                      className="mt-2"
                      onClick={() => markAsRead(notification.id)}
                    >
                      읽음 처리
                    </CButton>
                  )}

                  {notification.readOrNot === 'READ' && (
                    <CButton
                      color="danger"
                      size="sm"
                      className="mt-2"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      삭제하기
                    </CButton>
                  )}
                </CListGroupItem>
              );
            })
          )}
        </CListGroup>
      </CModalBody>
    </CModal>
  );
}

export default AlertPopup;
