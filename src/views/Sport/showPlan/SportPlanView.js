import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; // Redux에서 user 정보 가져오기
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CCardText,
  CCardTitle,
  CButton,
} from "@coreui/react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 hook

// 날짜 포맷팅 함수
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("ko-KR", options).format(date);
};

const SportPlanView = () => {
  const user = useSelector((state) => state.user); // Redux에서 user 정보 가져오기
  const [sportPlans, setSportPlans] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const fetchSportPlans = async () => {
    try {
      const response = await axios.get(
        `https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/sport/plan/view?userId=${user.userId}`, // Redux에서 가져온 userId를 사용
        {
          withCredentials: true,
        }
      );
      setSportPlans(response.data);
    } catch (error) {
      setError("운동 계획을 불러오는 중 문제가 발생했습니다.");
    }
  };

  // POST 요청으로 기록을 저장하는 함수
  const saveSportRecord = async (plan) => {
    try {
      // 필요한 데이터만 전송하도록 특정 데이터만 추출
      const recordData = {
        userId: user.userId,
        items: plan.items.map((item) => ({
          sportName: item.sportName,
          sportStart: item.sportStart,
          sportEnd: item.sportEnd,
          kcal: item.kcal,
        })),
        id: plan.id,
        totalDuration: plan.totalDuration,
        totalBurnKcal: plan.totalBurnKcal,
        totalSportStart: plan.totalSportStart,
        totalSportEnd: plan.totalSportEnd,
      };

      const response = await axios.post(
        "https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/sport/save/record",
        recordData, // 필요한 데이터만 전송
        { withCredentials: true }
      );
      alert("운동 기록이 성공적으로 저장되었습니다.");
    } catch (error) {
      alert("운동 기록 저장 중 문제가 발생했습니다.");
      console.error("Error saving sport record:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("Deleting plan with ID:", id); // 디버그용 로그
      await axios.delete(`https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/sport/delete/plan/${id}?userId=${user.userId}`); // Redux에서 가져온 userId를 사용
      alert("운동계획 삭제 완료");
      fetchSportPlans(); // 삭제 후 새로고침
    } catch (error) {
      alert("삭제하는 중 문제가 발생했습니다.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/sport/modify/plan/${id}`); // 수정 페이지로 이동
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchSportPlans(); // userId가 있을 때만 운동 계획을 불러옴
    }
  }, [user]);

  return (
    <div>
      {user ? (
        <>
          <h2>{user.name}님의 운동 계획</h2>
          <h5 style={{ color: '#77DD77', fontWeight: "bold" }}>
            운동이 완료되면 기록하기를 눌러주세요!
          </h5>
        </>
      ) : (
        <h2>로그인 해주세요</h2>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {sportPlans.length === 0 && !error && <p>운동 계획이 없습니다.</p>}
      {sportPlans.length > 0 && (
        <CRow>
          {sportPlans.map((plan, index) => (
            <CCol sm="12" md="6" lg="4" key={index} className="mb-4">
              <CCard>
                <CCardHeader>
                  <CCardTitle>
                    운동 계획 {plan.id} : {plan.items.map(item => item.sportName).join(', ')}
                  </CCardTitle>
                </CCardHeader>
                <CCardBody>
                  <CCardText>
                    <strong>시작 시간:</strong> {formatDateTime(plan.totalSportStart)} <br />
                    <strong>종료 시간:</strong> {formatDateTime(plan.totalSportEnd)} <br />
                    <strong>총 운동 시간:</strong> {plan.totalDuration} 분 <br />
                    <strong>예상 소모 칼로리:</strong> {plan.totalBurnKcal} kcal
                  </CCardText>
                  <div className="d-flex justify-content-end">
                    <CButton
                      color="warning"
                      onClick={() => handleEdit(plan.id)}
                      className="me-2"
                    >
                      수정
                    </CButton>
                    <CButton
                      color="danger"
                      onClick={() => handleDelete(plan.id)}
                      className="me-2"
                    >
                      삭제
                    </CButton>
                    <CButton
                      color="success"
                      onClick={() => saveSportRecord(plan)} // 운동 기록 저장 버튼
                    >
                      기록하기
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      )}
    </div>
  );
};

export default SportPlanView;
