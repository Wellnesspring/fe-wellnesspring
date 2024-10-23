import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCol, CCardHeader, CRow, CButton, CProgress } from '@coreui/react';
import { CChartBar, CChartPie } from '@coreui/react-chartjs';
import axios from 'axios';

const Statistics = () => {
  const [data, setData] = useState([]);
  const [averageData, setAverageData] = useState({
    Average_sport_time: 0,
    Average_meal_kcal: 0,
    Average_meal_protein: 0,
    Average_meal_fiber: 0,
    Average_meal_cholesterol: 0,
    Average_meal_na: 0,
    Average_meal_fat: 0,
    Average_meal_carbohydrate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 데이터 요청
    const fetchData = async () => {
      try {
        const [statisticsResponse, avgResponse] = await Promise.all([
          axios.get('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/statistics'),
          axios.get('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/statistics/avg')
        ]);

        // 성공적으로 데이터 가져오기
        console.log('통계 데이터 요청 성공:', statisticsResponse.data);
        console.log('기준 데이터 요청 성공:', avgResponse.data);

        // 데이터가 배열로 반환되므로 첫 번째 객체를 사용
        const statisticsData = statisticsResponse.data;
        const avgData = avgResponse.data[0];

        setData(statisticsData);
        setAverageData({
          Average_sport_time: avgData.Average_sport_time || 0,
          Average_meal_kcal: avgData.Average_meal_kcal || 0,
          Average_meal_protein: avgData.Average_meal_protein || 0,
          Average_meal_fiber: avgData.Average_meal_fiber || 0,
          Average_meal_cholesterol: avgData.Average_meal_cholesterol || 0,
          Average_meal_na: avgData.Average_meal_na || 0,
          Average_meal_fat: avgData.Average_meal_fat || 0,
          Average_meal_carbohydrate: avgData.Average_meal_carbohydrate || 0
        });

        setLoading(false);
      } catch (error) {
        console.error('데이터 요청 오류:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>데이터를 불러오는 중입니다...</p>;
  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다: {error.message}</p>;

  // 날짜별 데이터를 그룹화
  const groupedData = data.reduce((acc, item) => {
    const { today, meal_kcal, sport_kcal } = item;
    if (!acc[today]) {
      acc[today] = { meal_kcal: 0, sport_kcal: 0 };
    }
    acc[today].meal_kcal += meal_kcal;
    acc[today].sport_kcal += sport_kcal;
    return acc;
  }, {});

  // 차트 데이터 준비
  const dates = Object.keys(groupedData);
  const mealKcalData = dates.map(date => groupedData[date].meal_kcal);
  const sportKcalData = dates.map(date => groupedData[date].sport_kcal);

  // 기준치와 현재 데이터의 상대적 위치 계산
  const calculatePercentage = (currentValue, averageValue) => {
    return averageValue > 0 ? (currentValue / averageValue) * 100 : 0;
  };

  const sportTimePercentage = calculatePercentage(data.reduce((sum, item) => sum + item.sport_time, 0) / data.length, averageData.Average_sport_time);
  const kcalPercentage = calculatePercentage(data.reduce((sum, item) => sum + item.meal_kcal, 0) / data.length, averageData.Average_meal_kcal);
  const proteinPercentage = calculatePercentage(data.reduce((sum, item) => sum + item.meal_protein, 0) / data.length, averageData.Average_meal_protein);

  return (
    <div>
      <h1>Dashboard</h1>
      <CRow>
        <CCol xs={12}>
          {/* 여기에 필요한 추가 내용 */}
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>칼로리 변동</CCardHeader>
            <CCardBody>
              <CButton color="link" href="/dashboard/statistics/kcal">자세히 보기</CButton>
              <CChartBar
                data={{
                  labels: dates,
                  datasets: [
                    {
                      label: '섭취 칼로리',
                      backgroundColor: '#f87979',
                      data: mealKcalData,
                    },
                    {
                      label: '소모 칼로리',
                      backgroundColor: '#36A2EB',
                      data: sportKcalData,
                    }
                  ],
                }}
                labels="칼로리 변동"
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>영양소 섭취</CCardHeader>
            <CCardBody>
              <CButton color="link" href="/dashboard/statistics/food">자세히 보기</CButton>
              <CChartPie
                data={{
                  labels: ['탄수화물', '단백질', '지방'],
                  datasets: [
                    {
                      data: [data.reduce((sum, item) => sum + item.meal_carbohydrate, 0) / data.length,
                        data.reduce((sum, item) => sum + item.meal_protein, 0) / data.length,
                        data.reduce((sum, item) => sum + item.meal_fat, 0) / data.length],
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>나의 수준</CCardHeader>
            <CCardBody>
              <CButton color="link" href="/dashboard/statistics/level">자세히 보기</CButton>
              <CProgress color="success" variant="striped" animated value={sportTimePercentage}>
                운동 상위 {Math.round(sportTimePercentage)}%
              </CProgress>
              <p></p>
              <CProgress color="info" variant="striped" animated value={kcalPercentage}>
                칼로리 섭취량 상위 {Math.round(kcalPercentage)}%
              </CProgress>
              <p></p>
              <CProgress color="warning" variant="striped" animated value={proteinPercentage}>
                단백질 섭취량 상위 {Math.round(proteinPercentage)}%
              </CProgress>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Statistics;
