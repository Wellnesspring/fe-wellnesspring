import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CButton, CFormInput, CFormLabel, CForm, CRow, CCol } from "@coreui/react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const ModifySportPlan = () => {
  const { id } = useParams(); // URL에서 sportid 가져오기
  const [sportPlan, setSportPlan] = useState({
    totalSportStart: "",
    totalSportEnd: "",
    totalDuration: "",
    totalBurnKcal: "",
    items: [] // Initially 'items', but will be sent as 'sportItems'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSportPlan = async () => {
      try {
        const response = await axios.get(`https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/sport/plan/${id}`);
        setSportPlan(response.data); // 운동 계획과 운동 항목 데이터 모두 설정
      } catch (error) {
        console.error("운동 계획을 불러오는 중 문제가 발생했습니다.");
      }
    };

    fetchSportPlan();
  }, [id]);

  const handleModify = async () => {
    try {
      // Modify the sportPlan object to rename 'items' to 'sportItems'
      const modifiedPlan = {
        ...sportPlan,
        sportItems: sportPlan.items, // Rename 'items' to 'sportItems'
      };
      delete modifiedPlan.items; // Remove 'items' key to avoid duplication

      await axios.post("https://port-0-wellnesspring-m2kc1xi38f876e5d.sel4.cloudtype.app/sport/modify/plan", modifiedPlan); // 운동 계획과 항목들 함께 전송
      alert("운동계획 수정 완료");
      navigate("/"); // 수정 후 메인 페이지로 이동
    } catch (error) {
      alert("수정하는 중 문제가 발생했습니다.");
      console.error("Error modifying sport plan", error);
    }
  };

  const handleSportItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...sportPlan.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setSportPlan({ ...sportPlan, items: updatedItems });
  };

  const handleSportItemDateChange = (date, field, index) => {
    const updatedItems = [...sportPlan.items];
    updatedItems[index] = { ...updatedItems[index], [field]: date };
    setSportPlan({ ...sportPlan, items: updatedItems });
  };

  return (
    <div>
      <h2>운동 계획 수정</h2>
      {sportPlan && sportPlan.items && (
        <div>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="totalSportStart">시작 시간</CFormLabel>
              <CFormInput
                id="totalSportStart"
                value={sportPlan.totalSportStart || ""}
                onChange={(e) =>
                  setSportPlan({ ...sportPlan, totalSportStart: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="totalSportEnd">종료 시간</CFormLabel>
              <CFormInput
                id="totalSportEnd"
                value={sportPlan.totalSportEnd || ""}
                onChange={(e) =>
                  setSportPlan({ ...sportPlan, totalSportEnd: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="totalDuration">총 운동 시간</CFormLabel>
              <CFormInput
                id="totalDuration"
                value={sportPlan.totalDuration || ""}
                onChange={(e) =>
                  setSportPlan({ ...sportPlan, totalDuration: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="totalBurnKcal">소모 칼로리</CFormLabel>
              <CFormInput
                id="totalBurnKcal"
                value={sportPlan.totalBurnKcal || ""}
                onChange={(e) =>
                  setSportPlan({ ...sportPlan, totalBurnKcal: e.target.value })
                }
              />
            </div>

            {sportPlan.items.map((item, index) => (
              <div key={index}>
                <CRow>
                  <CCol xs="12" md="6">
                    <CFormLabel>운동 이름</CFormLabel>
                    <CFormInput
                      name="sportName"
                      value={item.sportName || ""}
                      onChange={(e) => handleSportItemChange(e, index)}
                    />
                  </CCol>

                  <CCol xs="12" md="6">
                    <CFormLabel>운동 칼로리</CFormLabel>
                    <CFormInput
                      name="kcal"
                      value={item.kcal || ""}
                      onChange={(e) => handleSportItemChange(e, index)}
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol xs="12" md="6">
                    <CFormLabel>운동 시작 시간</CFormLabel>
                    <Datetime
                      value={item.sportStart}
                      onChange={(date) => handleSportItemDateChange(date, "sportStart", index)}
                    />
                  </CCol>

                  <CCol xs="12" md="6">
                    <CFormLabel>운동 종료 시간</CFormLabel>
                    <Datetime
                      value={item.sportEnd}
                      onChange={(date) => handleSportItemDateChange(date, "sportEnd", index)}
                    />
                  </CCol>
                </CRow>
              </div>
            ))}

            <CButton color="primary" onClick={handleModify}>
              수정 완료
            </CButton>
          </CForm>
        </div>
      )}
    </div>
  );
};

export default ModifySportPlan;
