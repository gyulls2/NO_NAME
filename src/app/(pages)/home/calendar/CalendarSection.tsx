'use client';

import moment from 'moment';
import { useEffect, useState } from 'react';
import Calendar, { OnArgs } from 'react-calendar';
import './calendar.css';
import { fetchPosts } from '@/data/fetch/postFetch';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type WeightType = {
  content: string;
  title: string;
};

const CalendarSection = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [isDiet, setIsDiet] = useState(true);
  const [activeStartDate, setActiveStartDate] = useState<ValuePiece>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1); // 현재 달의 첫째 날
  });

  // 선택된 달 구하기
  const handleActiveStartDateChange = ({ activeStartDate }: OnArgs) => {
    setActiveStartDate(activeStartDate);
  };

  // 체중 데이터 불러오기
  const [weightData, setWeightData] = useState<WeightType[]>([]);

  useEffect(() => {
    if (!isDiet) {
      const fetchWeight = async () => {
        const keyword = moment(activeStartDate).format('YYYY.MM');
        const response = await fetchPosts('weight', undefined, keyword);
        console.log(response);
        if (response) {
          const weightArr = response.map(item => ({
            title: item.title,
            content: item.content,
          }));
          setWeightData(weightArr);
        }
      };
      fetchWeight();
    }
  }, [isDiet, activeStartDate]);

  // 각 날짜 타일에 컨텐츠 추가
  const addContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    // date가 weightData의 title과 일치하면 해당 content를 표시
    const match = weightData.find(
      item => item.title === moment(date).format('YYYY.MM.DD'),
    );

    return (
      <div>
        {match ? (
          <span className="text-gray-500 font-semibold">{match.content}kg</span>
        ) : (
          <span className="text-gray-500 font-semibold">-</span>
        )}
      </div>
    );
  };

  // 기록이 있을 경우 배경색 변경
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const match = weightData.find(
        item => item.title === moment(date).format('YYYY.MM.DD'),
      );

      if (match) {
        return 'weight-recorded';
      }
    }
    return '';
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex gap-2 absolute top-12">
        <button
          className={`py-1 px-2 rounded-full flex items-center ${isDiet ? 'bg-main-primary-yellow text-white' : 'border-2 border-main-primary-yellow'}`}
          onClick={() => setIsDiet(true)}
        >
          <div className="rounded-full w-3 h-3 bg-point-green mr-2"></div>
          <p className="text-sm">먹었어요</p>
        </button>
        <button
          className={`py-1 px-2 rounded-full flex items-center ${!isDiet ? 'bg-main-primary-yellow text-white' : 'border-2 border-main-primary-yellow'}`}
          onClick={() => setIsDiet(false)}
        >
          <div className="rounded-full w-3 h-3 bg-point-pink mr-2"></div>
          <p className="text-sm">몸무게</p>
        </button>
      </div>

      <div>
        <Calendar
          onActiveStartDateChange={handleActiveStartDateChange}
          onChange={onChange}
          value={value}
          next2Label={null}
          prev2Label={null}
          showNeighboringMonth={false}
          formatDay={(locale, date) => moment(date).format('D')}
          formatYear={(locale, date) => moment(date).format('YYYY')}
          formatMonthYear={(locale, date) => moment(date).format('YYYY. MM')}
          formatLongDate={(locale, date) => moment(date).format('YYYY.MM.DD')}
          minDetail="year"
          calendarType="gregory"
          tileContent={addContent}
          tileClassName={tileClassName}
        />
      </div>
    </div>
  );
};

export default CalendarSection;