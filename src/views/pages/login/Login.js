import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'
import { useDispatch } from 'react-redux'

/**
 * 카카오로 로그인하러 보내는 fn
 */
export function reqSignKakao() {
  const api_key = "b9f133be5346a55f04808ed817f6a6ca";
  const redirect_url = new URL(window.location.href).href;
  const request_url = `https://kauth.kakao.com/oauth/authorize?client_id=${api_key}&redirect_uri=${redirect_url}&response_type=code&state=wellnesspring`;

  window.location.href = request_url;
}

const Login = () => {
  const inputs = useRef([]);
  const dispatcher = useDispatch();
  const nav = useNavigate();

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
      alert("카카오 로그인을 취소 하셨습니다\n" + error_description);
      nav("/login");
    } else if (code != null && code.length && state == "wellnesspring") {
      reqFnId = setTimeout(() => useKakao(code), 500);
    }

    return () => clearTimeout(reqFnId);
  });

  /**
   * 버튼 클릭 대행 이벤트
   * @param {KeyboardEvent} event
   */
  function enterEffect(event) {
    if(event.key == "Enter") {
      reqSignin();
    }
  }

  /**
   * 로그인 시도
   */
  function reqSignin() {
    if (inputs.current[0]?.value.trim().length > 0 && inputs.current[1]?.value.trim().length > 0) {
      const user = {};
      for (const element of inputs.current) {
        user[element.name] = element.value;
      }
      
      axios.post("https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/auth/signinProc", user, {withCredentials: true})
      .then((res) => {
        dispatcher({type: "set", user: res.data});
        sessionStorage.setItem("wellnessUser", JSON.stringify(res.data));
        nav("/dashboard");
      }).catch((err) => {
        if (err?.status === 401) {
          alert("로그인에 실패했습니다\n잘못된 계정 및 비밀번호입니다");
        }
      });
    } else {
      alert("로그인에 실패했습니다\n잘못된 계정 및 비밀번호입니다");
    }
  }

  /**
   * 카카오에서 받은 인가코드로 로그인 처리
   * @param {string} code 
   */
  function useKakao(code) {
    axios.get("https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/auth/kakao?code=" + code)
    .then(res => {
      dispatcher({type: "set", user: res.data});
      nav("/dashboard");
    }).catch(err => {
      alert("소셜 로그인이 등록된 계정이 없습니다");
      nav("/login");
    });
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm className='mb-4'>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        name='userId'
                        ref={(e) => {inputs.current[0] = (e)}}
                        required
                        onKeyUp={e => enterEffect(e)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name='userPw'
                        placeholder="Password"
                        ref={(e) => {inputs.current[1] = (e)}}
                        required
                        onKeyUp={e => enterEffect(e)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={reqSignin}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                  <CCol style={{display: 'flex', justifyContent: "space-around"}}>
                    <CImage src='https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/5f9c58c2017800001.png'
                      width={'40px'} onClick={reqSignKakao} />
                  </CCol>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
