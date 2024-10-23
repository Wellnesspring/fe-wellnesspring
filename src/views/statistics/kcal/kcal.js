import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CButton, CWidgetStatsB } from '@coreui/react'
import {
  CChartBar,
  CChartLine
} from '@coreui/react-chartjs'
import axios from 'axios'

const Kcal = () => {
  const [data, setData] = useState({
    dailyIntake: Array(7).fill(0), // 일주일간 섭취 칼로리 데이터
    dailyExpenditure: Array(7).fill(0), // 일주일간 소모 칼로리 데이터
    weight: Array(7).fill(0), // 일주일간 몸무게 데이터
    intakeGoal: 0,
    expenditureGoal: 0
  });

  useEffect(() => {
    axios.get('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/statistics/kcal')
      .then(response => {
        const responseData = response.data[0]; // 배열의 첫 번째 요소 가져오기
        const today = new Date(responseData.today); // 현재 날짜
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // 이번 주 월요일
        const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(startOfWeek);
          date.setDate(date.getDate() + i);
          return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        });

        // 칼로리 데이터를 일주일 간에 맞추기
        const dailyIntake = daysOfWeek.map(date => date === responseData.today ? responseData.meal_kcal : 0);
        const dailyExpenditure = daysOfWeek.map(date => date === responseData.today ? responseData.sport_kcal : 0);
        const weight = daysOfWeek.map(date => date === responseData.today ? responseData.weight : 0);

        // 목표 계산
        const intakeGoal = responseData.kcalplan > 0 ? (responseData.meal_kcal / responseData.kcalplan) * 100 : 0;
        const expenditureGoal = responseData.meal_kcal > 0 ? (responseData.sport_kcal / responseData.meal_kcal) * 100 : 0;

        setData({
          dailyIntake,
          dailyExpenditure,
          weight,
          intakeGoal,
          expenditureGoal
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

  return (
    <CRow>
      <CCol xs={12}>
        {/* 빈 컬럼 */}
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>칼로리 변동</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: daysOfWeek,
                datasets: [
                  {
                    label: '섭취 칼로리',
                    backgroundColor: '#f87979',
                    data: data.dailyIntake,
                  },
                  {
                    label: '소모 칼로리',
                    backgroundColor: '#36A2EB',
                    data: data.dailyExpenditure,
                  },
                ],
              }}
              labels="days"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>몸무게 변화</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: daysOfWeek,
                datasets: [
                  {
                    label: '몸무게',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: data.weight,
                    yAxisID: 'y-axis-1'
                  },
                  {
                    label: '섭취한 칼로리',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: data.dailyIntake,
                    yAxisID: 'y-axis-2'
                  },
                  {
                    label: '소모한 칼로리',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: data.dailyExpenditure,
                    yAxisID: 'y-axis-2'
                  }
                ]
              }}
              options={{
                scales: {
                  yAxes: [
                    {
                      id: 'y-axis-1',
                      type: 'linear',
                      position: 'left',
                      ticks: {
                        beginAtZero: true
                      },
                      scaleLabel: {
                        display: true,
                        labelString: '몸무게 (kg)'
                      }
                    },
                    {
                      id: 'y-axis-2',
                      type: 'linear',
                      position: 'right',
                      ticks: {
                        beginAtZero: true
                      },
                      scaleLabel: {
                        display: true,
                        labelString: '칼로리'
                      }
                    }
                  ]
                }
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>목표 섭취량까지</CCardHeader>
          <CCardBody>
            <CCol xs={6}>
              <CWidgetStatsB
                className="mb-3"
                progress={{ color: 'success', value: Math.min(100, data.intakeGoal) }}
                text=""
                title="이번주 섭취 목표"
                value={`${Math.round(data.intakeGoal)}%`}
              />
              <CWidgetStatsB
                className="mb-3"
                progress={{ color: 'success', value: Math.min(100, data.expenditureGoal) }}
                text=""
                title="이번주 소모 목표"
                value={`${Math.round(data.expenditureGoal)}%`}
              />
            </CCol>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Kcal
