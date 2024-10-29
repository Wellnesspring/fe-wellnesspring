import { CCard, CCardBody, CCol, CImage, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import KakaoImg from "src/images/kakao_login_medium_narrow.png";
import { reqSignKakao } from "../../pages/login/Login";

function Social() {
  const nav = useNavigate();
  const user = useSelector(store => store.user);
  const dispatcher = useDispatch();

  useEffect(() => {
    // 소셜(카카오) 로그인 동의 후 리다이렉트 된 것인지 확인
    const url_params = new URL(window.location.href).searchParams;
    const code = url_params?.get("code");
    const state = url_params?.get("state");
    const error = url_params?.get("error");
    const error_description = url_params?.get("error_description");
    let reqFnId = 0;
    
    if (error != null && error.length) {
      console.log(error);
      console.log(error_description);
      alert("카카오 간편 로그인 등록이 취소 되었습니다\n" + error_description);
      nav("/users/profile");
    } else if (code != null && code.length && state == "wellnesspring") {
      reqFnId = setTimeout(() => addKakao(code), 500);
    }

    return () => clearTimeout(reqFnId);
  }, []);

  /**
   * 카카오 계정 정보 제공 동의하러 보내는 fn
   */
  function kakaoAgree() {
    sessionStorage.setItem("userId", user.userId);
    reqSignKakao();
  }
  
  /**
   * 반환된 카카오 인증 코드를 서버에 보내 간편 로그인 등록 절차 수행
   * @param {string} code 카카오에서 보낸 사용자 정보에 접근할 수 있는 인증 코드
   */
  function addKakao(code) {
    const userId = sessionStorage.getItem("userId");

    axios.get("https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/user/kakao?userId=" + userId + "&code=" + code)
    .then(res => {
      dispatcher({type: "set", user: res.data});
      alert("간편 소셜 로그인 등록에 성공했습니다");
      nav("/users/profile");
    }).catch(err => {
      alert("간편 소셜 로그인 등록에 실패했습니다");
      nav("/users/profile");
    });
  }

  return (<>
    <CModalHeader>
      <CModalTitle>소셜 로그인 등록</CModalTitle>
    </CModalHeader>
		<CModalBody>
      {/* 나중에 소셜 로그인 종류가 추가되면 동적으로 만들어야함 */}
        <CCard className="mb-4">
          <CCardBody className="d-flex" style={{justifyContent: "space-between"}}>
            <p style={{fontSize: "x-large", margin: "auto 0"}}>Kakao</p>
            <CImage align="end" src={KakaoImg} onClick={kakaoAgree} />
          </CCardBody>
        </CCard>
		</CModalBody>
  </>);
}

export default Social;