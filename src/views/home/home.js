import React from 'react'
import { CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'

const Home = () => {
  return (
    <CRow className="justify-content-center mt-5">
      <CCol md="8">
        {/* 웹사이트 소개 카드 */}
        <CCard>
          <CCardBody>
            <h1 className="text-center">Welcome to Wellnesspring</h1>
            <p className="text-center">
              Wellnesspring에서 당신의 운동과 식사를 기록하세요.
              Wellnesspring이 당신의 건강을 지켜드리겠습니다.
            </p>

            {/* 이미지 추가 */}
            <div className="text-center">
              <img
                src="https://cdn.pixabay.com/photo/2017/06/01/18/46/cook-2364221_1280.jpg"
                alt="Wellness 이미지"
                style={{ width: '100%', height: 'auto', marginTop: '20px', borderRadius: '8px' }}
              />
            </div>

            <div className="text-center mt-4">
              <CButton href="http://localhost:3000/login" color="link" size="lg" className="me-3">
                로그인
              </CButton>
              <CButton href="http://localhost:3000/register" color="link" size="lg">
                회원가입
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol md="8" className="mt-5">
      </CCol>
    </CRow>
  )
}

export default Home
