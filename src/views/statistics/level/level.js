import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CCard, CCardBody, CCol, CCardHeader, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const Level = () => {
  const [data, setData] = useState({});
  const [userData, setUserData] = useState([]);
  const [categories, setCategories] = useState([]);
  const maxEntries = 20; // 최대 표시 개수 설정
  const user = useSelector(store => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const userId = user.userId;
    axios.get(`https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/dashboard/statistics/level?id=${userId}`)
      .then(response => {
        const fetchedData = response.data;

        // 카테고리별로 데이터를 그룹화
        const groupedData = fetchedData.reduce((acc, item) => {
          if (!acc[item.sport_name]) {
            acc[item.sport_name] = [];
          }
          acc[item.sport_name].push(item);
          return acc;
        }, {});

        // 카테고리와 사용자 데이터 상태 설정
        setCategories(Object.keys(groupedData));
        setData(groupedData);
        setUserData(fetchedData.filter(item => item.user_id === userId)); // 특정 사용자 데이터 필터링
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [user, navigate]);

  return (
    <CRow>
      {categories.map((category, index) => (
        <CCol xs={6} key={index}>
          <CCard className="mb-4">
            <CCardHeader>{`${category} 순위`}</CCardHeader>
            <CCardBody>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">순위</CTableHeaderCell>
                    <CTableHeaderCell scope="col">이름</CTableHeaderCell>
                    <CTableHeaderCell scope="col">{`${category} 시간`}</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data[category]
                    .sort((a, b) => b.sport_time - a.sport_time) // 정렬
                    .slice(0, maxEntries) // 최대 20개 항목만 표시
                    .map((item, idx) => (
                      <CTableRow key={item.user_id}>
                        <CTableHeaderCell scope="row">{idx + 1}</CTableHeaderCell>
                        <CTableDataCell>{item.name}</CTableDataCell>
                        <CTableDataCell>{item.sport_time}</CTableDataCell>
                      </CTableRow>
                    ))}
                  <CTableRow color="dark">
                    <CTableHeaderCell scope="row">나</CTableHeaderCell>
                    <CTableDataCell>{user.name || '내이름'}</CTableDataCell>
                    <CTableDataCell>{userData.find(item => item.sport_name === category)?.sport_time || 0}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
};

export default Level;
