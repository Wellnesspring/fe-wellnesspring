import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CContainer, CRow, CCol, CButton, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle
} from '@coreui/react';
import axios from 'axios';
import '@coreui/coreui/dist/css/coreui.min.css';
import { useSelector } from "react-redux";

function AddFood() {
  const location = useLocation();
  const navigate = useNavigate(); // navigate 함수 추가
  const queryParams = new URLSearchParams(location.search);
  const meal_id = queryParams.get('meal_id');
  const [searchString, setSearchString] = useState('');
  const [foodData, setFoodData] = useState([]);
  const [amount, setAmount] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorFood, setFavorFood] = useState([]); // 좋아하는 음식 목록 상태 추가
  const user = useSelector(store => store.user);

  useEffect(() => {
    // 로그인 상태 확인: user가 없을 때 로그인 페이지로 이동
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchFavorFood = async () => {
      try {
        const userId = user.userId; // 실제 사용자 ID로 대체
        const response = await axios.get(`https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/getFavorFood?user_id=${userId}`);
        setFavorFood(response.data); // 좋아하는 음식 목록을 상태에 저장
      } catch (error) {
        console.error('Error fetching favorite food:', error);
      }
    };

    if (user) { // user가 존재할 때만 좋아하는 음식 목록을 가져옴
      fetchFavorFood();
    }
  }, [user]);

  const handleSearch = async () => {
    if (!searchString) return; // 빈 검색어는 무시

    try {
      const response = await axios.get(`https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/getNutrient?search_string=${searchString}`);
      setFoodData(response.data);

      // 검색이 성공적이면 검색 기록에 추가
      if (!searchHistory.includes(searchString)) {
        setSearchHistory((prevHistory) => [searchString, ...prevHistory]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearchFromHistory = (historyItem) => {
    setSearchString(historyItem); // 클릭한 검색 기록으로 검색어 설정
    handleSearch(); // 검색 실행
  };

  const handleAddMeal = async () => {
    if (selectedFood) {
      const parsedMealId = parseInt(meal_id, 10);
      const parsedFoodId = parseInt(selectedFood.id, 10);
      const parsedAmount = parseFloat(amount);

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert('입력량을 다시 확인해 주세요.');
        return;
      } else if (isNaN(parsedMealId)) {
        alert('잘못된 url을 사용하고 있습니다.');
        return;
      } else if (isNaN(parsedFoodId)) {
        alert('음식을 다시 검색해 주세요.');
        return;
      }

      try {
        const response = await axios.post('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/addMealDetails', new URLSearchParams({
          meal_id: parsedMealId,
          food_id: parsedFoodId,
          amount: parsedAmount,
        }));

        if (response.status === 200) {
          alert('음식이 성공적으로 추가되었습니다.');
        } else {
          alert('음식 추가에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error adding meal details:', error);
      }
    }

    setVisible(false);
  };

  return (
    <CContainer>
      <CRow className="mt-4 mb-3">
        <CCol>
          <h2>음식 추가</h2>
        </CCol>
      </CRow>

      <CRow className="mb-3 align-items-center">
        <CCol xs="8">
          <CFormInput
            type="text"
            placeholder="음식 데이터베이스를 이름으로 검색"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </CCol>
        <CCol xs="4">
          <CButton color="success" onClick={handleSearch}>검색</CButton>
        </CCol>
      </CRow>

      {/* 최근 검색 기록 표시 */}
      {searchHistory.length > 0 && (
        <CRow className="mb-3">
          <CCol>
            <h5>최근 검색 기록:</h5>
            {searchHistory.map((historyItem, index) => (
              <CButton
                key={index}
                color="link"
                onClick={() => handleSearchFromHistory(historyItem)}
              >
                {historyItem}
              </CButton>
            ))}
          </CCol>
        </CRow>
      )}

      {/* 좋아하는 음식 표시 */}
      {favorFood.length > 0 && (
        <CRow className="mb-3">
          <CCol>
            <h5>좋아하는 음식:</h5>
            {favorFood.map((food, index) => (
              <CButton
                key={index}
                color="link"
                onClick={() => {
                  setSearchString(food.food_name); // 음식 이름으로 검색어 설정
                  handleSearch(); // 검색 실행
                }}
              >
                {food.food_name}
              </CButton>
            ))}
          </CCol>
        </CRow>
      )}

      <CRow className="mb-3">
        <CCol>
          <h5>검색 결과:</h5>
          {foodData.length === 0 ? (
            <p>검색된 음식이 없습니다.</p>
          ) : (
            foodData.map((food, index) => (
              <CRow key={index} className="mb-2 align-items-center">
                <CCol xs="6">
                  <span>{food.food_name}</span>
                </CCol>
                <CCol xs="4">
                  <CFormInput
                    type="number"
                    placeholder="양 입력"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!isNaN(value) && value.trim() !== '') {
                        setAmount(value);
                      } else {
                        setAmount(0);
                      }
                    }}
                  />
                </CCol>
                <CCol xs="2" className="d-flex justify-content-between">
                  <CButton
                    color="primary"
                    onClick={() => {
                      setSelectedFood(food);
                      setVisible(true);
                    }}
                  >
                    추가
                  </CButton>
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setAmount(0); // 초기화 버튼 클릭 시 amount를 0으로 설정
                    }}
                  >
                    초기화
                  </CButton>
                </CCol>
              </CRow>
            ))
          )}
        </CCol>
      </CRow>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>음식 추가 확인</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>해당 식사에 {selectedFood?.food_name}을(를) 추가할까요?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>아니오</CButton>
          <CButton color="primary" onClick={handleAddMeal}>예</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
}

export default AddFood;
