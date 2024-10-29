import React, { useState } from 'react';
import {
  CAvatar,
  CBadge,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilBell,
  cilAccountLogout,
  cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';

import AlertPopup from 'src/views/alarm/alarm/AlertPopup';
import { chooseAvatar } from '../../views/users/editProfile/EditProfile';
import { useNavigate } from 'react-router-dom';

/**
 * 로그아웃 진행
 * @param {string} msg 로그아웃시 사용자에게 보여줄 메세지(기본값: 로그아웃 되었습니다)
 * @param {import('react-router-dom').NavigateFunction} nav useNavigate의 반환 함수 (!필수!)
 * @param {import('redux').Dispatch} dispatcher useDispatch의 반환 함수 (!필수!)
*/
export function logOut(msg, nav, dispatcher) {
  if(msg == null || msg.length < 1) msg = '로그아웃 되었습니다';
  if(nav != null && dispatcher != null) {
    alert(msg);
    nav("/dashboard");
    sessionStorage.removeItem("wellnessUser");
    sessionStorage.removeItem("userId");
    dispatcher({type: "set", user: null});
  } else {
    alert("로그아웃 중 문제가 발생하였습니다");
  }
}

const AppHeaderDropdown = () => {
  const nav = useNavigate();
  const user = useSelector(state => state.user);
  const dispatcher = useDispatch();

  // 알림 모달을 위한 상태 관리
  const [showNotifications, setShowNotifications] = useState(false);

  const handleBellClick = (e) => {
    e.preventDefault(); // 기본 동작 차단
    console.log('Bell clicked!'); // 클릭 이벤트 확인용 로그
    setShowNotifications(true); // 모달 열기
  };

  return user ? (
    <>
      <div className='d-flex' style={{alignItems: 'center'}}>
        {/* 아바타 드롭다운 */}
        <CDropdown variant="nav-item">
          <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
            <CAvatar src={chooseAvatar(user?.profileImg ?? 1)} size="md" className='avatar-overfit' />
          </CDropdownToggle>
          <CDropdownMenu className="pt-0" placement="bottom-end">
            <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
            <CDropdownItem style={{cursor: "pointer"}} onClick={() => {nav("/users/profile")}}>
              <CIcon icon={cilUser} className="me-2" />
              Profile
            </CDropdownItem>
            <CDropdownDivider />
            <CDropdownItem onClick={e => logOut(null, nav, dispatcher)}>
              <CIcon icon={cilAccountLogout} className="me-2" />
              Log Out
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

        {/* 알림 버튼 */}
        <CButton color="link" onClick={handleBellClick} style={{ textAlign: 'left', padding: 0, marginLeft: '18px' }}>
          <CIcon icon={cilBell} className="me-2" style={{ fontSize: '1.5rem' }} />
          <CBadge color="info" className="ms-2">
          </CBadge>

        </CButton>
      </div>

      {/* 알림 모달 */}
      <AlertPopup
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  ) : ( // 로그인 안된 경우
    <>
      <CButton color='secondary' onClick={() => nav("/login")}>Log In</CButton>
    </>
  );
}

export default AppHeaderDropdown;
