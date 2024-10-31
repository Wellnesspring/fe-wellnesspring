import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCol, CCardHeader, CRow, CButton } from '@coreui/react';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const Sport = () => {
  const [sportData, setSportData] = useState(Array(7).fill(0)); // 이번 주 운동 시간을 담을 배열
  const [lastWeekData, setLastWeekData] = useState(Array(7).fill(0)); // 지난주 운동 시간을 담을 배열
  const user = useSelector(store => store.user);
  const navigate = useNavigate();

  const fetchSportData = async () => {
    const userId = user.userId; // 사용자 ID 설정
    try {
      // 2주 전까지의 데이터 요청
      const response = await axios.get(`https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/sport?id=${userId}`);
      const data = response.data;

      // 이번 주 운동 시간을 계산
      const currentWeekData = Array(7).fill(0);
      const previousWeekData = Array(7).fill(0);

      data.forEach((item) => {
        const dayIndex = new Date(item.sport_date).getDay(); // 요일을 인덱스로 가져오기 (0 = 일요일, 6 = 토요일)

        // 이번 주 데이터
        const today = new Date();
        const daysDifference = Math.floor((today - new Date(item.sport_date)) / (1000 * 60 * 60 * 24));
        if (daysDifference >= 0 && daysDifference < 7) {
          if (dayIndex > 0) currentWeekData[dayIndex - 1] += item.sport_time; // 1~6 (월~토)로 설정
        }
        // 지난 주 데이터
        else if (daysDifference >= 7 && daysDifference < 14) {
          if (dayIndex > 0) previousWeekData[dayIndex - 1] += item.sport_time; // 1~6 (월~토)로 설정
        }
      });

      setSportData(currentWeekData);
      setLastWeekData(previousWeekData);
    } catch (error) {
      console.error('데이터 요청 오류:', error);
    }
  };

  useEffect(() => {
    // 로그인 상태 확인: user가 없을 때 로그인 페이지로 이동
    if (!user) {
      navigate('/login');
    } else {
      fetchSportData();
    }
  }, [user, navigate]);

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>운동 시간</CCardHeader>
          <CCardBody>
            <CButton color="link">자세히 보기</CButton>
            <CChartBar
              data={{
                labels: ['월', '화', '수', '목', '금', '토', '일'],
                datasets: [
                  {
                    label: '운동 시간',
                    backgroundColor: '#f87979',
                    data: sportData,
                  },
                ],
              }}
              labels="kcal"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>지난주와 비교</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: ['월', '화', '수', '목', '금', '토', '일'],
                datasets: [
                  {
                    label: '지난주 운동',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: lastWeekData,
                  },
                  {
                    label: '이번주 운동',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: sportData,
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Sport;
