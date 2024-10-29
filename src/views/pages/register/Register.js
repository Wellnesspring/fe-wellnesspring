import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBirthdayCake, cilLockLocked, cilPhone, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

/**
 * 전화번호 입력시 '-' 자동 생성
 * @param {HTMLInputElement} element 전화번호를 입력할 input
 */
export function phoneNumEffect(element) {
  let value = element.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
  
  if (value.length > 7) {
    value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3'); // 3-4-4 형식
  } else if (value.length > 3 && value.length <= 7) {
    value = value.replace(/(\d{3})(\d+)/, '$1-$2'); // 3자리 후 하이픈 추가
  }

  element.value = value;
}

const Register = () => {
  const inputs = useRef([document.createElement("input")]);
  const nav = useNavigate();
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    inputs?.current[0].setCustomValidity('unchecked');
  }, []);

  /**
   * 입력한 id가 이메일이면서 중복 확인 여부 확인
   * @param {HTMLInputElement} element
   */
  function switchValidId(element) {
    const invalidText = ["올바른 이메일이 아닙니다", "아이디 중복 확인을 해야합니다"];
    const invalidElement = element.nextSibling;

    if (element.validity.patternMismatch) {
      invalidElement.textContent = invalidText[0];
    } else if (element.validity.customError) {
      invalidElement.textContent = invalidText[1];
    }
  }

  /**
   * id 중복 체크
   */
  function idCheck() {
    const idInput = inputs.current[0];

    if(idInput.value.length > 0) { // 어떠한 이메일을 입력했고 그것이 조건에 맞는 이메일인 경우
      axios.get("https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/auth/check", {
        params: {idck: idInput.value},
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then((res) => {
        if (res.status == 204) {
          idInput.classList.add('is-valid');
          idInput.classList.remove('is-invalid');
          idInput.setCustomValidity('');
          idInput.readOnly = true;
          return;
        } else if (res.status == 207) {
          alert("아이디 중복, 사용불가");
        }
      }).catch(() => {
        alert("에러가 발생했습니다\n다시 시도해 주십시오");
      });
    }

    idInput.focus();
    idInput.classList.add('is-invalid');
    idInput.classList.remove('is-valid');
  }

  /**
   * 비밀번호, 비밀번호 확인 실시간 검사 효과
   * @param {HTMLInputElement} element 
   */
  function passwordCheck(element) {
    if(element.name) {  // 비밀번호
      let regExp = element.validity.valid;
      switchValidPw(element, regExp);
    } else {  // 비밀번호 확인
      let regExp = element.value === inputs.current[1].value;
      switchValidPw(element, regExp);
    }
    
    /**
     * @param {HTMLInputElement} element 
     * @param {boolean} bool 
     */
    function switchValidPw(element, bool) {
      if(!element.value.length) { // 입력된 값이 없으면
        element.classList.add('is-invalid');
      } else if(bool) {  // 입력된 값이 있으면서 유효하면
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
        element.setCustomValidity('');
      } else {  // 입력된 값이 있으면서 유효하지 않으면
        element.classList.remove('is-valid');
        element.classList.add('is-invalid');
        element.setCustomValidity('invalid');
      }
    }
  }

  /**
   * 사용자가 입력한 정보로 회원가입 진행
   * @param {SubmitEvent} event 
   */
  function reqSignin(event) {
    event.preventDefault();
    const avatar = [[2, 3, 6, 9], [1, 4, 5, 7, 8]];
  
    if (event.currentTarget.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      let user = {};
    
      for (const element of inputs.current) {
        switch(element.name) {
          case 'birthday':
            user["serialNumF"] = element.value.split("-").join("").substring(2).concat(element.value.substring(0,2) < 20 ? 1 : 3);
            break;
          case 'gender':
            const gender = element.value == "M" ? 0 : 1;
            if(element.checked) {
              user["serialNumF"] = user.serialNumF.substring(0, 6) + (Number(user.serialNumF.substring(6)) + gender);
              user["profileImg"] = avatar[gender][Math.random() * avatar[gender].length];
            }
            break;
          default:
            user = {...user, [element.name]: element.value};
            break;
        }
      }
      
      // 회원가입 요청 보내기
      axios.post("https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/auth/signup", user)
      .then(res => {
        alert("회원가입에 성공했습니다");
        nav("/login");
      }).catch(err => {
        alert("회원가입에 실패했습니다");
        console.log(err);
      });
      setValidated(false);
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm className="needs-validation" validated={validated} onSubmit={reqSignin} noValidate>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type='email'
                      ref={e => {inputs.current[0] = e}}
                      name='userId'
                      placeholder="Email"
                      feedbackInvalid="올바른 이메일이 아닙니다"
                      pattern='^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-_]+\.[a-zA-Z]{2,}$'
                      required
                      tooltipFeedback
                      onChange={e => switchValidId(e.target)}
                    />
                    <CButton type='button' color='secondary' variant='outline' onClick={idCheck}>Check</CButton>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                      <CFormInput
                        type="password"
                        ref={e => {inputs.current[1] = e}}
                        name='userPw'
                        className='form-control'
                        placeholder="Password"
                        feedbackInvalid="영 대소문자, 숫자, 특수문자(!@#$%*) 사용가능, 9~20자"
                        pattern='^[A-Za-z\d!@#$%*]{9,20}$'
                        minLength={9}
                        maxLength={20}
                        required
                        tooltipFeedback
                        onInput={e => passwordCheck(e.target)}
                      />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      feedbackInvalid="비밀번호가 일치하지 않습니다"
                      required
                      tooltipFeedback
                      onInput={e => passwordCheck(e.target)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      ref={e => inputs.current[2] = e}
                      name='name'
                      placeholder="Name"
                      feedbackInvalid="이름을 입력해주세요"
                      minLength={2}
                      required
                      tooltipFeedback
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      ref={e => inputs.current[3] = e}
                      name='phone'
                      placeholder="Phone"
                      maxLength={13}
                      required
                      tooltipFeedback
                      onChange={e => phoneNumEffect(e.target)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilBirthdayCake} />
                    </CInputGroupText>
                    <CInputGroupText>Birthday</CInputGroupText>
                    <CFormInput
                      type='date'
                      ref={e => inputs.current[4] = e}
                      name='birthday'
                      placeholder="Birthday"
                      defaultValue={"2000-01-01"}
                      required
                      tooltipFeedback
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder='Gender' disabled></CFormInput>
                    <CInputGroupText>
                      <CFormCheck
                        type='radio'
                        ref={e => inputs.current[5] = e}
                        id='gender1'
                        name='gender'
                        label={"Male"}
                        value={'M'}
                        inline
                        feedbackInvalid="성별을 선택해주세요"
                        required
                        tooltipFeedback
                      />
                      <CFormCheck
                        type='radio'
                        ref={e => inputs.current[6] = e}
                        id='gender2'
                        name='gender'
                        label={"Female"}
                        value={'F'}
                        inline
                        required
                        tooltipFeedback
                      />
                    </CInputGroupText>
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type='submit' color="success">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
