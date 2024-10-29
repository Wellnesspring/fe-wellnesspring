import React, { useState } from 'react';
import {
  CContainer, CRow, CCol, CFormInput, CButton, CFormLabel, CFormSelect, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import axios from 'axios';

function App() {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [foodList, setFoodList] = useState([]); // 음식 목록 상태
  const [selectedFood, setSelectedFood] = useState(null); // 선택된 음식의 영양 성분 데이터 상태
  const userId = 'userid_test'; // Assuming a fixed user ID, change as needed

  // 검색 요청 핸들러
  const handleSearch = () => {
    axios.get('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/getNutrient', {
      params: {
        search_string: searchTerm, // 검색어 전달
      },
    })
      .then((response) => {
        console.log('Food List:', response.data);
        setFoodList(response.data); // 검색 결과를 상태에 저장
      })
      .catch((error) => {
        console.error('Error fetching food:', error);
      });
  };

  // 음식 선택 핸들러 (목록에서 음식 클릭 시)
  const handleFoodSelect = (foodId) => {
    const selected = foodList.find(food => food.id === foodId);
    setSelectedFood(selected); // 선택된 음식 데이터 설정
  };

  // 즐겨찾기 추가 핸들러
  const handleAddFavorite = (foodId) => {
    axios.post('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/addFavor', null, {
      params: {
        user_id: userId, // 사용자 ID
        food_id: foodId, // 음식 ID
      },
    })
      .then(() => {
        alert('즐겨찾기에 추가되었습니다!');
      })
      .catch((error) => {
        console.error('Error adding favorite food:', error);
      });
  };

  return (
    <CContainer className="mt-4">
      {/* 제목 */}
      <CRow className="mb-4">
        <CCol>
          <h2>칼로리 표, 음식에 대한 영양 성분</h2>
        </CCol>
      </CRow>

      {/* 검색창 */}
      <CRow className="mb-3">
        <CCol xs="12" md="8">
          <CFormLabel htmlFor="foodSearch">음식, 브랜드 또는 레스토랑 검색</CFormLabel>
          <div className="d-flex">
            <CFormInput
              type="text"
              id="foodSearch"
              placeholder="김치"
              value={searchTerm} // 입력 값을 상태로 관리
              onChange={(e) => setSearchTerm(e.target.value)} // 입력 변화 처리
            />
            <CButton color="dark" className="ms-2" onClick={handleSearch}> {/* 검색 버튼 */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001a1.007 1.007 0 0 0-.117.118l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.117-.118zm-5.742 0a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
              </svg>
            </CButton>
          </div>
        </CCol>
      </CRow>

      {/* 음식 매칭 */}
      <CRow>
        <CCol>
          <h5>음식 매칭:</h5>
          <CFormSelect size="lg" onChange={(e) => handleFoodSelect(parseInt(e.target.value))}>
            <option>음식 목록</option>
            {foodList.length > 0 ? (
              foodList.map((food, index) => (
                <option key={index} value={food.id}>{food.food_name}</option>
              ))
            ) : (
              <option>검색 결과가 없습니다.</option>
            )}
          </CFormSelect>
        </CCol>
      </CRow>

      {/* 선택된 음식의 영양 성분 정보 */}
      {selectedFood && (
        <CRow className="mt-4">
          <CCol>
            <h5>영양 성분 정보</h5>
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
                  <CTableHeaderCell>즐겨찾기</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>{selectedFood.food_name}</CTableDataCell>
                  <CTableDataCell>{selectedFood.kcal}</CTableDataCell>
                  <CTableDataCell>{selectedFood.amount}</CTableDataCell>
                  <CTableDataCell>{selectedFood.fiber}</CTableDataCell>
                  <CTableDataCell>{selectedFood.na}</CTableDataCell>
                  <CTableDataCell>{selectedFood.protein}</CTableDataCell>
                  <CTableDataCell>{selectedFood.fat}</CTableDataCell>
                  <CTableDataCell>{selectedFood.cholesterol}</CTableDataCell>
                  <CTableDataCell>{selectedFood.carbohydrate}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="success" onClick={() => handleAddFavorite(selectedFood.id)}>
                      즐겨찾기 추가
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>
      )}
    </CContainer>
  );
}

export default App;
