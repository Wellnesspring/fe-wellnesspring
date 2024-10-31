import React, { useState, useEffect } from 'react';
import {
  CContainer, CRow, CCol, CFormInput, CButton, CCard, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SelectMeals() {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
  const [mealDetails, setMealDetails] = useState([]); // 선택한 식사 세부 정보 상태
  const user = useSelector(store => store.user);
  const navigate = useNavigate();

  // 사용자 인증 상태 확인
  useEffect(() => {
    if (!user || !user.userId) {
      navigate('/login'); // 로그인 페이지로 이동
    }
  }, [user, navigate]);

  // 검색 요청 핸들러
  const handleSearch = () => {
    const userId = user.userId;

    axios.get('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/getMealbyString', {
      params: {
        meal_name: searchTerm,
        user_id: userId
      }
    })
      .then(response => {
        console.log('Search Results:', response.data);
        setSearchResults(response.data); // 결과를 상태에 저장
      })
      .catch(error => {
        if (error.response) {
          console.error('Response error:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up the request:', error.message);
        }
      });
  };

  // 식사 세부 정보 요청 핸들러
  const fetchMealDetails = (mealId) => {
    console.log("Fetching meal details for ID:", mealId);
    axios.get(`https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/getMealDetail`, {
      params: {
        meal_id: parseInt(mealId, 10)
      }
    })
      .then(response => {
        console.log('Meal Details:', response.data);
        setMealDetails(response.data); // 선택한 식사 세부 정보를 상태에 저장
      })
      .catch(error => {
        if (error.response) {
          console.error('Response error:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up the request:', error.message);
        }
      });
  };

  return (
    <CContainer fluid className="mt-4">
      <CRow>
        {/* 페이지 제목 */}
        <CCol>
          <h2>개인 식사</h2>
        </CCol>
      </CRow>

      <CRow className="mt-4">
        {/* 개인 식사 검색 */}
        <CCol md={6}>
          <CRow>
            <CCol>
              <h5>개인 식사 검색:</h5>
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol>
              <div className="d-flex">
                <CFormInput
                  type="text"
                  placeholder="검색"
                  value={searchTerm} // 입력값을 상태로 관리
                  onChange={(e) => setSearchTerm(e.target.value)} // 입력값 변경 핸들러
                />
                <CButton color="dark" className="ms-2" onClick={handleSearch}> {/* 검색 버튼 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001a1.007 1.007 0 0 0-.117.118l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.117-.118zm-5.742 0a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
                  </svg>
                </CButton>
              </div>
              <p className="mt-2">
                오른쪽에 보거나 삭제할 식사를 클릭하세요. 식사를 작성하거나 변경하려면 <a href="../food/addMeals">이 페이지</a>로 이동하세요.
              </p>
            </CCol>
          </CRow>
        </CCol>

        {/* 식사 매칭 */}
        <CCol md={6}>
          <h5>식사 매칭:</h5>
          <CCard>
            <CCardBody>
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((meal, index) => {
                    const mealtime = new Date(meal.meal_time);
                    const formattedDate = mealtime.toISOString().split('T')[0];
                    return (
                      <li key={index}>
                        <CButton color="link" onClick={() => fetchMealDetails(meal.meal_id)}>
                          {meal.meal} ({formattedDate})
                        </CButton>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                '결과를 찾을 수 없음.'
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 식사 세부 정보 */}
      <CRow className="mt-4">
        <CCol>
          <h5>식사 세부 정보</h5>
          <CTable hover responsive>
            <CTableHead color="primary">
              <CTableRow>
                <CTableHeaderCell>음식 이름</CTableHeaderCell>
                <CTableHeaderCell>칼로리</CTableHeaderCell>
                <CTableHeaderCell>양</CTableHeaderCell>
                <CTableHeaderCell>섬유질</CTableHeaderCell>
                <CTableHeaderCell>나트륨</CTableHeaderCell>
                <CTableHeaderCell>단백질</CTableHeaderCell>
                <CTableHeaderCell>지방</CTableHeaderCell>
                <CTableHeaderCell>콜레스테롤</CTableHeaderCell>
                <CTableHeaderCell>탄수화물</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {mealDetails.length > 0 ? mealDetails.map((detail, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{detail.food_name}</CTableDataCell>
                  <CTableDataCell>{detail.kcal}</CTableDataCell>
                  <CTableDataCell>{detail.amount}</CTableDataCell>
                  <CTableDataCell>{detail.fiber}</CTableDataCell>
                  <CTableDataCell>{detail.na}</CTableDataCell>
                  <CTableDataCell>{detail.protein}</CTableDataCell>
                  <CTableDataCell>{detail.fat}</CTableDataCell>
                  <CTableDataCell>{detail.cholesterol}</CTableDataCell>
                  <CTableDataCell>{detail.carbohydrate}</CTableDataCell>
                </CTableRow>
              )) : (
                <CTableRow>
                  <CTableDataCell colSpan="9">세부 정보가 없습니다.</CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default SelectMeals;
