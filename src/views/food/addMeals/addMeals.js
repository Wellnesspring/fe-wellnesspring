import React, { useEffect, useState } from 'react';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton, CModal, CModalHeader, CModalBody, CModalFooter, CCard} from '@coreui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

function AddMeals() {
  const navigate = useNavigate(); // navigate 함수 가져오기
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [mealData, setMealData] = useState([]);
  const [newMealName, setNewMealName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMealId, setEditMealId] = useState(null);
  const [editedMealName, setEditedMealName] = useState('');
  const [dailyGoal, setDailyGoal] = useState({
    calories: '',
    sodium: '',
    protein: '',
    fiber: '',
    fat: '',
    cholesterol: '',
    carbs: '',
  });
  const user = useSelector(store => store.user);
  const [userGoals, setUserGoals] = useState({});
  const [editedAmounts, setEditedAmounts] = useState({});

  // 사용자가 로그인되어 있는지 확인
  useEffect(() => {
    if (!user) {  // user가 없으면 로그인 페이지로 리디렉션
      navigate('/login');
    }
  }, [user, navigate]);

  const incrementDate = () => {
    setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
  };

  const decrementDate = () => {
    setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000));
  };

  const fetchMealData = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const user_id = user.userId;

    axios.get('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/getMealbyDate', {
      params: {
        meal_date: formattedDate,
        user_id: user_id,
      },
    })
      .then(response => {
        setMealData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    if (selectedDate && user) {  // user가 있을 때만 데이터 가져오기
      fetchMealData(selectedDate);
    }
  }, [selectedDate, user]);

  // meal_id 기준으로 데이터를 그룹화하는 함수
  const groupByMealId = () => {
    const groupedData = {};

    mealData.forEach((meal) => {
      if (!groupedData[meal.meal_id]) {
        groupedData[meal.meal_id] = [];
      }
      groupedData[meal.meal_id].push(meal);
    });

    return groupedData;
  };

  const groupedMealData = groupByMealId();
  const ThisUserId = user.userId;

  const handleAddMeal = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    if (!newMealName) {
      alert('식사 이름을 입력하세요.');
      return;
    }

    axios.post('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/addMeal', null, {
      params: {
        meal: newMealName,
        user_id: ThisUserId,
        date: formattedDate
      },
    })
      .then(response => {
        console.log('식사 추가 성공:', response.data);
        fetchMealData(selectedDate);  // 선택된 날짜의 데이터를 다시 가져옴
        setNewMealName('');  // 입력 필드 초기화
      })
      .catch(error => {
        console.error('Error adding meal:', error);
      });
  };
  const handleDeleteMeal = (mealId) => {
    if (window.confirm('정말로 이 식사를 삭제하시겠습니까?')) {
      axios.post(`https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/deleteMeal`, null, {
        params: {
          meal_id: mealId,
        },
      })
        .then(response => {
          console.log('식사 삭제 성공:', response.data);
          fetchMealData(selectedDate);
        })
        .catch(error => {
          console.error('Error deleting meal:', error);
        });
    }
  };

  const handleEditMeal = (mealId, currentMealName) => {
    setEditMealId(mealId);
    setEditedMealName(currentMealName);
    setIsModalOpen(true);
  };

  const handleSaveMealEdit = () => {
    axios.post(`https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/updateMeal`, null, {
      params: {
        meal_id: editMealId,
        meal: editedMealName,
      },
    })
      .then(response => {
        console.log('식사 이름 수정 성공:', response.data);
        fetchMealData(selectedDate);
        setIsModalOpen(false);
      })
      .catch(error => {
        console.error('Error updating meal:', error);
      });
  };

  const handleDeleteFood = (mealDetailId) => {
    if (window.confirm('정말로 이 음식을 삭제하시겠습니까?')) {
      axios.post(`https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/meals/deleteMealDetail`, null, {
        params: {
          mealDetailId: mealDetailId,
        },
      })
        .then(response => {
          console.log('음식 삭제 성공:', response.data);
          fetchMealData(selectedDate);
        })
        .catch(error => {
          console.error('Error deleting food:', error);
        });
    }
  };

  // amount 변경 핸들러
  const handleAmountChange = (mealDetailId, newAmount) => {
    setEditedAmounts(prevState => ({
      ...prevState,
      [mealDetailId]: newAmount,
    }));
  };




  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'left' }}>
        <CButton color="link" onClick={decrementDate} style={{ marginRight: '10px' }}>⬅️</CButton>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy/MM/dd"
        />
        <CButton color="link" onClick={incrementDate}>➡️</CButton>
      </div>
      <div style={{ display: 'flex', gap: '40px' }}>

        <CCard style ={{width:'800px'}}>


          <hr style={{ margin: '20px 0' }} />

          {/* 데이터가 없을 때 메시지 표시 */}
          {mealData.length === 0 ? (
            <p>데이터가 없습니다. 식사 데이터를 추가하세요.</p>
          ) : (
            Object.keys(groupedMealData).map((mealId) => (
              <div key={mealId} style={{ marginTop: '20px' }}>
                <h3>{groupedMealData[mealId][0].meal}</h3>
                <div>
                  <a href={`../food/addFood?meal_id=${mealId}`} style={{ marginRight: '10px' }}>음식 추가</a>
                  <CButton color="link" onClick={() => handleEditMeal(mealId, groupedMealData[mealId][0].meal)}
                           style={{ marginRight: '10px' }}>식사 수정</CButton>
                  <CButton color="link" onClick={() => handleDeleteMeal(mealId)}>식사 삭제</CButton>
                </div>

                <CTable border="1" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '10px' }}>
                  <CTableHead>
                    <CTableRow style={{ backgroundColor: 'blue', color: 'white' }}>
                      <CTableHeaderCell scope="col">음식</CTableHeaderCell>
                      <CTableHeaderCell scope="col">칼로리</CTableHeaderCell>
                      <CTableHeaderCell scope="col">단백질</CTableHeaderCell>
                      <CTableHeaderCell scope="col">탄수화물</CTableHeaderCell>
                      <CTableHeaderCell scope="col">지방</CTableHeaderCell>
                      <CTableHeaderCell scope="col">나트륨</CTableHeaderCell>
                      <CTableHeaderCell scope="col">콜레스테롤</CTableHeaderCell>
                      <CTableHeaderCell scope="col">섬유질</CTableHeaderCell>
                      <CTableHeaderCell scope="col">양</CTableHeaderCell>
                      <CTableHeaderCell scope="col"></CTableHeaderCell> {/* 새로운 작업 열 추가 */}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {groupedMealData[mealId].map((meal, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{meal.food_name}</CTableDataCell>
                        <CTableDataCell>{meal.kcal}</CTableDataCell>
                        <CTableDataCell>{meal.protein}g</CTableDataCell>
                        <CTableDataCell>{meal.carbohydrate}g</CTableDataCell>
                        <CTableDataCell>{meal.fat}g</CTableDataCell>
                        <CTableDataCell>{meal.na}mg</CTableDataCell>
                        <CTableDataCell>{meal.cholesterol}mg</CTableDataCell>
                        <CTableDataCell>{meal.fiber}g</CTableDataCell>
                        <CTableDataCell>
                          {/* amount를 입력 필드로 변경 */}
                          <input
                            type="number"
                            value={editedAmounts[meal.id] !== undefined ? editedAmounts[meal.id] : meal.amount}
                            onChange={(e) => handleAmountChange(meal.id, e.target.value)}
                            style={{ width: '60px' }}
                          />g
                          {/* 저장 버튼 */}
                          {editedAmounts[meal.id] !== undefined && (
                            <CButton color="link" onClick={() => handleSaveAmount(meal.id)}>저장</CButton>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton color="link" onClick={() => handleDeleteFood(meal.id)}>삭제</CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            ))
          )}

          <hr style={{ margin: '20px 0' }} />

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={newMealName}
              onChange={(e) => setNewMealName(e.target.value)}
              placeholder="식사 이름 입력"
              style={{ marginRight: '10px' }}
            />
            <CButton color="link" onClick={handleAddMeal}>새로운 식사 추가</CButton>
          </div>

          {/* CoreUI 모달 창 */}
          <CModal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <CModalHeader>
              <h5>식사 수정</h5>
            </CModalHeader>
            <CModalBody>
              <input
                type="text"
                value={editedMealName}
                onChange={(e) => setEditedMealName(e.target.value)}
                placeholder="식사 이름 수정"
                style={{ width: '100%' }}
              />
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setIsModalOpen(false)}>
                취소
              </CButton>
              <CButton color="primary" onClick={handleSaveMealEdit}>
                저장
              </CButton>
            </CModalFooter>
          </CModal>
        </CCard>
        {/*<CCard style ={{width:'500px'}}>
          <h2>오늘의 영양 목표</h2>
          <div style={{ marginBottom: '20px' }}>
            <label>칼로리 목표: </label>
            <input
              type="number"
              value={dailyGoal.calories}
              onChange={(e) => setDailyGoal({ ...dailyGoal, calories: e.target.value })}
              placeholder="칼로리 입력"
            /> kcal
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>나트륨 목표: </label>
            <input
              type="number"
              value={dailyGoal.sodium}
              onChange={(e) => setDailyGoal({ ...dailyGoal, sodium: e.target.value })}
              placeholder="나트륨 입력"
            /> mg
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>단백질 목표: </label>
            <input
              type="number"
              value={dailyGoal.protein}
              onChange={(e) => setDailyGoal({ ...dailyGoal, protein: e.target.value })}
              placeholder="단백질 입력"
            /> g
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>섬유질 목표: </label>
            <input
              type="number"
              value={dailyGoal.fiber}
              onChange={(e) => setDailyGoal({ ...dailyGoal, fiber: e.target.value })}
              placeholder="섬유질 입력"
            /> g
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>지방 목표: </label>
            <input
              type="number"
              value={dailyGoal.fat}
              onChange={(e) => setDailyGoal({ ...dailyGoal, fat: e.target.value })}
              placeholder="지방 입력"
            /> g
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>콜레스테롤 목표: </label>
            <input
              type="number"
              value={dailyGoal.cholesterol}
              onChange={(e) => setDailyGoal({ ...dailyGoal, cholesterol: e.target.value })}
              placeholder="콜레스테롤 입력"
            /> mg
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>탄수화물 목표: </label>
            <input
              type="number"
              value={dailyGoal.carbs}
              onChange={(e) => setDailyGoal({ ...dailyGoal, carbs: e.target.value })}
              placeholder="탄수화물 입력"
            /> g
          </div>
          {userGoals === 0 ? (
            <CButton color="link" style = {{width: '100px'}} onClick={handleSaveGoal}>목표 저장</CButton>
          ) : (
            <>
              <CButton color="link" style = {{width: '100px'}} onClick={handleUpdateGoal}>목표 수정</CButton>
              <CButton color="link" style = {{width: '100px'}} onClick={handleDeleteGoal}>목표 삭제</CButton>
            </>
          )}
        </CCard>
        */}
      </div>

    </div>


  );
}

export default AddMeals;
