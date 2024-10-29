import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // react-datepicker 사용
import 'react-datepicker/dist/react-datepicker.css'; // react-datepicker 스타일
import { CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput } from '@coreui/react';
import { useSelector } from "react-redux";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import 'src/views/Sport/css/SportRecordView.css';

const SportRecordView = () => {
  const user = useSelector((state) => state.user);  // Redux에서 user 정보 가져오기
  const [records, setRecords] = useState([]);       // 운동 기록을 저장할 state
  const [filteredRecords, setFilteredRecords] = useState([]);  // 필터링된 운동 기록
  const [error, setError] = useState('');
  const [sortColumn, setSortColumn] = useState(''); // 정렬할 컬럼
  const [sortOrder, setSortOrder] = useState('asc'); // 정렬 순서 ('asc' or 'desc')
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [filterType, setFilterType] = useState('all'); // 필터 타입 (all, monthly, weekly)
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜

  useEffect(() => {
    const fetchSportRecords = async () => {
      try {
        const response = await axios.get(
          `https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/sport/record/view?userId=${user.userId}`,
          { withCredentials: true }
        );
        setRecords(response.data);
        setFilteredRecords(response.data);
      } catch (error) {
        setError("운동 기록을 불러오는 중 문제가 발생했습니다.");
      }
    };

    if (user) {
      fetchSportRecords();
    }
  }, [user]);  // user가 변경될 때마다 useEffect 실행

  // 정렬 함수
  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(order);

    const sortedRecords = [...filteredRecords].sort((a, b) => {
      if (column === 'sportName') {
        const nameA = a.items.map(item => item.sportName).join(', ');
        const nameB = b.items.map(item => item.sportName).join(', ');
        return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else if (column === 'totalSportStart' || column === 'totalSportEnd') {
        return order === 'asc'
          ? new Date(a[column]) - new Date(b[column])
          : new Date(b[column]) - new Date(a[column]);
      } else if (column === 'totalBurnKcal') {
        return order === 'asc' ? a[column] - b[column] : b[column] - a[column];
      }
      return 0;
    });

    setFilteredRecords(sortedRecords);  // 정렬된 데이터를 상태로 저장
  };

  // 월별 필터링
  const filterByMonth = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);

    const filtered = records.filter(record =>
      isWithinInterval(parseISO(record.totalSportStart), { start, end })
    );
    setFilteredRecords(filtered);
    setFilterType('monthly');
  };

  // 주간 필터링
  const filterByWeek = () => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);

    const filtered = records.filter(record =>
      isWithinInterval(parseISO(record.totalSportStart), { start, end })
    );
    setFilteredRecords(filtered);
    setFilterType('weekly');
  };

  // 전체 필터링
  const filterAll = () => {
    setFilteredRecords(records);
    setFilterType('all');
  };

  // 검색 필터링
  useEffect(() => {
    if (searchTerm) {
      const searchFiltered = records.filter(record =>
        record.items.some(item => item.sportName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRecords(searchFiltered);
    } else {
      setFilteredRecords(records);
    }
  }, [searchTerm, records]);

  return (
    <div>
      <CCard>
        <CCardHeader>
          <h3>운동 기록</h3>
          {/* 검색 입력 창 */}
          <CFormInput
            type="text"
            placeholder="운동명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '200px', marginBottom: '10px' }}
          />
          {/* 날짜 선택 필드 */}
          <div>
            <label>날짜 선택: </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              showMonthYearPicker={filterType === 'monthly'}
              showWeekNumbers={filterType === 'weekly'}
            />
          </div>
          {/* 필터링 버튼 */}
          <div>
            <button onClick={filterAll} className={filterType === 'all' ? 'active' : ''}>전체 보기</button>
            <button onClick={filterByMonth} className={filterType === 'monthly' ? 'active' : ''}>월별 보기</button>
            <button onClick={filterByWeek} className={filterType === 'weekly' ? 'active' : ''}>주간 보기</button>
          </div>
        </CCardHeader>
        <CCardBody>
          {error ? (
            <p>{error}</p>
          ) : (
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="sortable-header" onClick={() => handleSort('sportName')}>운동명</CTableHeaderCell>
                  <CTableHeaderCell className="sortable-header" onClick={() => handleSort('totalSportStart')}>운동 시작</CTableHeaderCell>
                  <CTableHeaderCell className="sortable-header" onClick={() => handleSort('totalSportEnd')}>운동 종료</CTableHeaderCell>
                  <CTableHeaderCell className="sortable-header" onClick={() => handleSort('totalBurnKcal')}>총 소모 칼로리</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredRecords.map((record) => (
                  <CTableRow key={record.id}>
                    <CTableDataCell>{record.items.map(item => item.sportName).join(', ')}</CTableDataCell>
                    <CTableDataCell>{new Date(record.totalSportStart).toLocaleString()}</CTableDataCell>
                    <CTableDataCell>{new Date(record.totalSportEnd).toLocaleString()}</CTableDataCell>
                    <CTableDataCell>{record.totalBurnKcal}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default SportRecordView;
