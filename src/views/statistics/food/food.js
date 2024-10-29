import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CButton, CProgress } from '@coreui/react'
import {
  CChartBar,
  CChartPie
} from '@coreui/react-chartjs'
import axios from 'axios'

const Food = () => {
  const [data, setData] = useState({
    fiberplan: 0,
    meal_na: 0,
    meal_fat: 0,
    cholesterolplan: 0,
    carbohydrateplan: 0,
    meal_kcal: 0,
    meal_protein: 0,
    meal_fiber: 0,
    meal_cholesterol: 0,
    proteinplan: 0,
    sport_kcal: 0,
    fatplan: 0,
    naplan: 0,
    meal_carbohydrate: 0,
    kcalplan: 0
  });

  useEffect(() => {
    const userId = 'testuser_id';
    // 데이터 요청
    axios.get('https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/statistics/food?id=${userId}')
      .then(response => {
        // 데이터 구조에 맞게 설정
        const responseData = response.data[0]; // 배열의 첫 번째 요소 가져오기
        setData({
          fiberplan: responseData.fiberplan || 0,
          meal_na: responseData.meal_na || 0,
          meal_fat: responseData.meal_fat || 0,
          cholesterolplan: responseData.cholesterolplan || 0,
          carbohydrateplan: responseData.carbohydrateplan || 0,
          meal_kcal: responseData.meal_kcal || 0,
          meal_protein: responseData.meal_protein || 0,
          meal_fiber: responseData.meal_fiber || 0,
          meal_cholesterol: responseData.meal_cholesterol || 0,
          proteinplan: responseData.proteinplan || 0,
          sport_kcal: responseData.sport_kcal || 0,
          fatplan: responseData.fatplan || 0,
          naplan: responseData.naplan || 0,
          meal_carbohydrate: responseData.meal_carbohydrate || 0,
          kcalplan: responseData.kcalplan || 0
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4" style={{ height: '700px' }}>
          <CCardHeader>영양소 섭취</CCardHeader>
          <CCardBody>
            <CChartPie
              data={{
                labels: ['탄수화물', '단백질', '지방'],
                datasets: [
                  {
                    data: [data.meal_carbohydrate, data.meal_protein, data.meal_fat],
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
        <CCard className="mb-4" style={{ height: '700px' }}>
          <CCardHeader>이번주 목표 및 현재 섭취량</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: ['탄수화물', '단백질', '지방', '나트륨', '식이섬유', '콜레스테롤'],
                datasets: [
                  {
                    label: '현재 섭취량',
                    backgroundColor: '#f87979',
                    data: [
                      data.meal_carbohydrate,
                      data.meal_protein,
                      data.meal_fat,
                      data.meal_na,
                      data.meal_fiber,
                      data.meal_cholesterol
                    ],
                  },
                  {
                    label: '목표 섭취량',
                    backgroundColor: '#7C8D9C',
                    data: [
                      data.carbohydrateplan,
                      data.proteinplan,
                      data.fatplan,
                      data.naplan,
                      data.fiberplan,
                      data.cholesterolplan
                    ],
                  },
                ],
              }}
              labels="nutrients"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Food
