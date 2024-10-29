import { cilBirthdayCake, cilLockLocked, cilPhone, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCard, CCardBody, CCol, CForm, CFormCheck, CFormInput, CImage, CInputGroup, CInputGroupText, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from "@coreui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { phoneNumEffect } from "../../pages/register/Register";
import { logOut } from "../../../components/header/AppHeaderDropdown";

import avatar1 from './../../../assets/images/avatars/1.jpg';
import avatar2 from './../../../assets/images/avatars/2.jpg';
import avatar3 from './../../../assets/images/avatars/3.jpg';
import avatar4 from './../../../assets/images/avatars/4.jpg';
import avatar5 from './../../../assets/images/avatars/5.jpg';
import avatar6 from './../../../assets/images/avatars/6.jpg';
import avatar7 from './../../../assets/images/avatars/7.jpg';
import avatar8 from './../../../assets/images/avatars/8.jpg';
import avatar9 from './../../../assets/images/avatars/9.jpg';

/** 
 * 사용자의 프로필 이미지 선택
 * @param {string | number} profileImg 사용자 프로필 이미지의 저장된 이름 | 기본 프로필 이미지 번호
 * @note profileImg에 빈 값이 들어올 경우를 대비해 남자면 1, 여자면 2를 넣어줘야함
 */
export function chooseAvatar(profileImg) {
  const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9];
  return Number(profileImg) ? avatars[Number(profileImg) - 1] : "https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/upload/" + profileImg;
}

function EditProfile() {
  const inputs = useRef([document.createElement("input")]);
  const user = useSelector(store => store.user);
  const dispatcher = useDispatch();
  const nav = useNavigate();
  const [userFull, setUserFull] = useState(false ? {
    "name" : "",
    "serialNumF" : "",
    "serialNumL" : "",
    "phone" : "",
    "height" : "",
    "weight" : "",
    "profileImg" : "",
    "birthday" : "",
    "gender" : ""
  } : {});
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const eventId = setTimeout(loadProfile, 500);
    return () => clearTimeout(eventId);
  }, []);

  /** 
   * 서버에 요청 보내서 유저 정보 불러오기
   */
  function loadProfile() {
    axios.get("https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/user/data?userId=" + user.userId)
    .then((res) => {
      const userData = res.data
      let someDate = userData.serialNumF.charAt(6) * 1 > 2 ? "20" : "19";
      
      for (let i = 0;; i += 2) {
        for (let j = 0; j < 2; j++) someDate += userData.serialNumF.charAt(i + j);
        if (i < 4) someDate += '-';
        else break;
      }
      
      userData["birthday"] = someDate;
      userData["gender"] = userData.serialNumF.charAt(6) * 1 % 2 ? "M" : "F";
      setUserFull(userData);
    }).catch(err => {
      alert("사용자 정보 불러오기에 실패했습니다 다시 시도해주십시오");
    });
  }

  /**
   * 값 입력시 객체에 반영
   * @param {HTMLInputElement} element 값이 입력되는 input
   */
  function valueTyping(element) {
    switch (element.name) {
      case "profileImg":  //  변경한 이미지로 프로필 사진을 임시로 보여주는 fn
        const reader = new FileReader();
        reader.onload = (e) => {
          inputs.current[0].previousSibling.src = e.target.result;
        };
        reader.readAsDataURL(element.files[0]);
        alert("수정된 프로필 사진 적용은 수정 버튼을 눌려야 적용됩니다");
        return;
      case "phone":
        phoneNumEffect(element);
    }

    setUserFull({...userFull, [element.name]: element.value})
  }

  /**
   * 사용자가 입력한 정보로 회원정보 수정 진행
   * @param {SubmitEvent} event 
   */
  function reqUpdate(event) {
    event.preventDefault();

    if (event.currentTarget.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      const formData = new FormData();
      
      userFull.serialNumF = userFull.birthday.split('-').join('').substring(2) + 
        ((userFull.birthday.substring(0, 4) * 1 > 2000 ? 2 : 0) + (userFull.gender == "M" ? 1 : 2));  
      formData.append("profileImgFile", inputs.current[0].files[0]);
      formData.append("profile", new Blob([JSON.stringify(userFull)], { type: "application/json" }));
      console.log(userFull);
      
      axios.put("https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/user/profile/edit", formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        dispatcher({type: 'set', user: res.data});
        sessionStorage.setItem("wellnessUser", JSON.stringify(res.data));
        alert("프로필이 수정되었습니다");
      }).catch(res => {
        alert("프로필 수정에 실패했습니다");
        console.dir(res);
      });
      console.log(userFull);
      setValidated(false);
    }
  }

  /**
   * 계정 삭제 진행
   */
  function reqDelete() {
    if(confirm("계정 삭제는 돌이킬 수 없습니다.\n정말로 계정을 삭제하시겠습니까?")) {
      axios.delete("https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/user/goodbye?userId=" + user.userId)
      .then(res => {
        logOut("계정이 삭제되었습니다", nav, dispatcher);
      }).catch(res => {
        alert("계정 삭제에 실패했습니다");
      });
    }
  }

  return (<>
    <CModalHeader>
      <CModalTitle>프로필</CModalTitle>
    </CModalHeader>
		<CModalBody>
      <CRow className="mb-4">
        <CCol className="justify-content-center d-flex">
          <CImage
            src={chooseAvatar(userFull.profileImg ?? userFull.gender == "M" ? 1 : 2)}
            width={150}
            height={150}
            style={{borderRadius: "50%"}}
            onClick={() => inputs.current[0].click()}
          />
          <input
            type="file"
            ref={e => {inputs.current[0] = e}}
            name="profileImg"
            accept="image/*"
            style={{display: "none"}}
            onChange={(e) => valueTyping(e.target)}
          />
        </CCol>
      </CRow>
			<CRow className="justify-content-center">
				<CCard className="mx-4 col-md-9">
					<CCardBody className="p-4">
						<CForm className="needs-validation" validated={validated} onSubmit={reqUpdate} noValidate>
            <CInputGroup className="mb-3">
								<CInputGroupText>
									<CIcon icon={cilUser} />
								</CInputGroupText>
								<CFormInput
									ref={e => inputs.current[1] = e}
									name='name'
                  value={userFull.name}
									placeholder="Name"
									feedbackInvalid="이름을 입력해주세요"
									minLength={2}
									required
									tooltipFeedback
                  onInput={e => valueTyping(e.target)}
								/>
							</CInputGroup>
							<CInputGroup className="mb-3">
								<CInputGroupText>
									<CIcon icon={cilPhone} />
								</CInputGroupText>
								<CFormInput
									ref={e => inputs.current[2] = e}
									name='phone'
                  value={userFull.phone}
									placeholder="Phone"
									maxLength={13}
									required
									tooltipFeedback
									onChange={e => valueTyping(e.target)}
								/>
							</CInputGroup>
							<CInputGroup className="mb-3">
								<CInputGroupText>
                  <CImage width={16} height={16} src="https://cdn-icons-png.flaticon.com/128/7990/7990208.png" />
                </CInputGroupText>
								<CFormInput
									type='number'
									ref={e => {inputs.current[3] = e}}
									name='height'
                  value={userFull.height}
									placeholder="Height (Kg)"
                  onInput={e => valueTyping(e.target)}
								/>
							</CInputGroup>
							<CInputGroup className="mb-3">
								<CInputGroupText>
                  <CImage width={16} height={16} src="https://cdn-icons-png.flaticon.com/128/8636/8636987.png" />
                </CInputGroupText>
								<CFormInput
									type='number'
									ref={e => {inputs.current[4] = e}}
									name='weight'
                  value={userFull.weight}
									placeholder="Weight (cm)"
                  onInput={e => valueTyping(e.target)}
								/>
							</CInputGroup>
              <CInputGroup className="mb-3">
								<CInputGroupText>
									<CIcon icon={cilBirthdayCake} />
								</CInputGroupText>
								<CInputGroupText>Birthday</CInputGroupText>
								<CFormInput
									type='date'
									ref={e => inputs.current[5] = e}
									name='birthday'
									placeholder="Birthday"
                  value={userFull.birthday}
									required
									tooltipFeedback
                  onChange={e => valueTyping(e.target)}
								/>
							</CInputGroup>
							<CInputGroup className="mb-3">
								<CInputGroupText>
									<CIcon icon={cilUser} />
								</CInputGroupText>
								<CFormInput placeholder='Gender' disabled></CFormInput>
								<CInputGroupText>
									<CFormCheck
										type='radio'
										ref={e => inputs.current[6] = e}
										id='gender1'
										name='gender'
										label={"Male"}
										value={'M'}
                    checked={'M' == userFull.gender}
										inline
										feedbackInvalid="성별을 선택해주세요"
										required
										tooltipFeedback
                    onChange={e => valueTyping(e.target)}
									/>
									<CFormCheck
										type='radio'
										ref={e => inputs.current[7] = e}
										id='gender2'
										name='gender'
										label={"Female"}
										value={'F'}
                    checked={'F' == userFull.gender}
										inline
										required
										tooltipFeedback
                    onChange={e => valueTyping(e.target)}
									/>
								</CInputGroupText>
							</CInputGroup>
							<CInputGroup className="mb-4">
								<CInputGroupText>
									<CIcon icon={cilLockLocked} />
								</CInputGroupText>
									<CFormInput
										type="password"
										ref={e => {inputs.current[8] = e}}
										name='userPw'
										className='form-control'
										placeholder="Password"
										feedbackInvalid="영 대소문자, 숫자, 특수문자(!@#$%*) 사용가능, 9~20자"
										pattern='^[A-Za-z\d!@#$%*]{9,20}$'
										minLength={9}
										maxLength={20}
										// required
										tooltipFeedback
                    onInput={e => valueTyping(e.target)}
									/>
							</CInputGroup>
							<div className="d-flex" style={{justifyContent: "space-around"}}>
								<CButton type='submit' color="success" style={{width: "150px"}}>프로필 수정</CButton>
								<CButton type='button' color="danger" style={{width: "150px"}} onClick={reqDelete}>계정삭제</CButton>
							</div>
						</CForm>
					</CCardBody>
				</CCard>
			</CRow>
		</CModalBody>
		<CModalFooter>
			회원가입 토대 + 프로필 사진 수정 구현 필요
		</CModalFooter>
  </>)
}

export default EditProfile;