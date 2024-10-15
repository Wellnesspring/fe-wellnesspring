import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar, cilWeightlifitng,
  cilDinner
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [

  {
    component: CNavTitle,
    name: 'Project',
  },
  {
    component: CNavItem,
    name: 'home',
    to: '/',
  },
  {
    component: CNavGroup,
    name: 'alarm',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'alarm',
        to: '/alarm/alarm',
      },
      {
        component: CNavItem,
        name: 'Subscribe',
        to: '/alarm/subscribe',
      },

    ],
  },
  {
    component: CNavGroup,
    name: 'Sport',
    icon: <CIcon icon={cilWeightlifitng} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: '계획하기',
        to: '/Sport/addPlan',
      },
      {
        component: CNavItem,
        name: '운동기록 보기',
        to: '/Sport/showRecord',
      },
      {
        component: CNavItem,
        name: '운동계획 보기',
        to: '/Sport/showPlan',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'statistics',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: '음식',
        to: '/statistics/food',
      },
      {
        component: CNavItem,
        name: '운동',
        to: '/statistics/sport',
      },
      {
        component: CNavItem,
        name: '칼로리',
        to: '/statistics/kcal',
      },
      {
        component: CNavItem,
        name: '나의 수준',
        to: '/statistics/level',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Food',
    icon: <CIcon icon={cilDinner} customClassName="nav-icon" />,
    items: [

      {
        component: CNavItem,
        name: '식사 추가',
        to: '/food/addMeals',
      },

      {
        component: CNavItem,
        name: '식사 정보 확인',
        to: '/food/selectMeals',
      },
      {
        component: CNavItem,
        name: '음식 정보 확인',
        to: '/food/selectNutrient',
      },
    ],
  },






]

export default _nav
