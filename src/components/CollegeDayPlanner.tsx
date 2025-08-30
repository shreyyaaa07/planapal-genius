import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Edit3, 
  Plus, 
  X, 
  Check, 
  Move, 
  Calendar, 
  MoreVertical, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award 
} from 'lucide-react';

interface ScheduleItem {
  subject: string;
  time: string;
  location: string;
  duration: number;
  type: 'lecture' | 'club' | 'free' | 'break';
  isExtra?: boolean;
}

interface ClubActivity {
  name: string;
  time: string;
  location: string;
  duration: number;
  travelTime: number;
}

const CollegeDayPlanner = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [newLecture, setNewLecture] = useState({ subject: '', time: '', location: '', duration: 60 });
  const [newActivity, setNewActivity] = useState({ name: '', time: '', location: '', duration: 30 });
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const subjects = [
    'Engineering Maths',
    'Engineering Physics', 
    'Engineering Graphics',
    'Engineering Design',
    'Engineering Chemistry',
    'Basic Electrical Engineering',
    'Procedural Programming',
    'Electronics'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [subjectSchedule, setSubjectSchedule] = useState<Record<string, ScheduleItem[]>>({
    Monday: [
      { subject: 'Engineering Maths', time: '08:00', location: 'Room 101', duration: 60, type: 'lecture' },
      { subject: 'Engineering Physics', time: '09:15', location: 'Room 103', duration: 60, type: 'lecture' },
      { subject: 'Free Time', time: '10:30', location: 'Campus', duration: 30, type: 'free' },
      { subject: 'Engineering Graphics', time: '11:00', location: 'Drawing Hall', duration: 60, type: 'lecture' },
      { subject: 'Lunch Break', time: '13:00', location: 'Cafeteria', duration: 60, type: 'break' },
      { subject: 'Procedural Programming', time: '14:00', location: 'Computer Lab', duration: 60, type: 'lecture' },
      { subject: 'Electronics', time: '15:15', location: 'Room 205', duration: 60, type: 'lecture' }
    ],
    Tuesday: [
      { subject: 'Engineering Chemistry', time: '08:00', location: 'Chemistry Lab', duration: 60, type: 'lecture' },
      { subject: 'Basic Electrical Engineering', time: '09:15', location: 'Room 201', duration: 60, type: 'lecture' },
      { subject: 'Engineering Design', time: '10:30', location: 'Design Studio', duration: 60, type: 'lecture' },
      { subject: 'Free Time', time: '11:45', location: 'Campus', duration: 75, type: 'free' },
      { subject: 'Lunch Break', time: '13:00', location: 'Cafeteria', duration: 60, type: 'break' },
      { subject: 'Engineering Physics', time: '14:00', location: 'Room 103', duration: 60, type: 'lecture' },
      { subject: 'Free Time', time: '15:15', location: 'Campus', duration: 45, type: 'free' }
    ],
    Wednesday: [
      { subject: 'Free Time', time: '08:00', location: 'Campus', duration: 60, type: 'free' },
      { subject: 'Electronics', time: '09:15', location: 'Room 205', duration: 60, type: 'lecture' },
      { subject: 'Engineering Graphics', time: '10:30', location: 'Drawing Hall', duration: 60, type: 'lecture' },
      { subject: 'Free Time', time: '11:45', location: 'Campus', duration: 75, type: 'free' },
      { subject: 'Lunch Break', time: '13:00', location: 'Cafeteria', duration: 60, type: 'break' },
      { subject: 'Engineering Chemistry', time: '14:00', location: 'Chemistry Lab', duration: 60, type: 'lecture' },
      { subject: 'Basic Electrical Engineering', time: '15:15', location: 'Room 201', duration: 60, type: 'lecture' }
    ],
    Thursday: [
      { subject: 'Engineering Design', time: '08:00', location: 'Design Studio', duration: 60, type: 'lecture' },
      { subject: 'Engineering Maths', time: '09:15', location: 'Room 101', duration: 60, type: 'lecture' },
      { subject: 'Engineering Physics', time: '10:30', location: 'Room 103', duration: 60, type: 'lecture' },
      { subject: 'Free Time', time: '11:45', location: 'Campus', duration: 75, type: 'free' },
      { subject: 'Lunch Break', time: '13:00', location: 'Cafeteria', duration: 60, type: 'break' },
      { subject: 'Procedural Programming', time: '14:00', location: 'Computer Lab', duration: 60, type: 'lecture' },
      { subject: 'Free Time', time: '15:15', location: 'Campus', duration: 45, type: 'free' }
    ],
    Friday: [
      { subject: 'Electronics', time: '08:00', location: 'Room 205', duration: 60, type: 'lecture' },
      { subject: 'Free Time', time: '09:15', location: 'Campus', duration: 75, type: 'free' },
      { subject: 'Basic Electrical Engineering', time: '10:30', location: 'Room 201', duration: 60, type: 'lecture' },
      { subject: 'Free Time', time: '11:45', location: 'Campus', duration: 75, type: 'free' },
      { subject: 'Lunch Break', time: '13:00', location: 'Cafeteria', duration: 60, type: 'break' },
      { subject: 'Engineering Design', time: '14:00', location: 'Design Studio', duration: 60, type: 'lecture' },
      { subject: 'Engineering Maths', time: '15:15', location: 'Room 101', duration: 60, type: 'lecture' }
    ],
    Saturday: [
      { subject: 'Free Time', time: '08:00', location: 'Campus', duration: 75, type: 'free' },
      { subject: 'Procedural Programming', time: '09:15', location: 'Computer Lab', duration: 60, type: 'lecture' },
      { subject: 'Electronics', time: '10:30', location: 'Room 205', duration: 60, type: 'lecture' },
      { subject: 'Free Time', time: '11:45', location: 'Campus', duration: 75, type: 'free' },
      { subject: 'Lunch Break', time: '13:00', location: 'Cafeteria', duration: 60, type: 'break' },
      { subject: 'Engineering Graphics', time: '14:00', location: 'Drawing Hall', duration: 60, type: 'lecture' },
      { subject: 'Free Time', time: '15:15', location: 'Campus', duration: 45, type: 'free' }
    ]
  });

  const [clubActivities, setClubActivities] = useState<Record<string, ClubActivity[]>>({
    Monday: [
      { name: 'Dance Club Practice', time: '16:30', location: 'Dance Studio', duration: 60, travelTime: 5 }
    ],
    Tuesday: [
      { name: 'Sports Club Training', time: '16:30', location: 'Sports Ground', duration: 30, travelTime: 8 }
    ],
    Wednesday: [
      { name: 'Dance Club Practice', time: '16:30', location: 'Dance Studio', duration: 60, travelTime: 5 }
    ],
    Thursday: [
      { name: 'Writing Club Workshop', time: '17:00', location: 'Library Hall', duration: 60, travelTime: 3 }
    ],
    Friday: [
      { name: 'Dance Club Performance Prep', time: '16:30', location: 'Dance Studio', duration: 30, travelTime: 5 }
    ],
    Saturday: [
      { name: 'Sports Club Match', time: '16:30', location: 'Sports Ground', duration: 60, travelTime: 8 }
    ]
  });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':');
    const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const getAllScheduleItems = () => {
    const items: any[] = [];
    
    const dayLectures = subjectSchedule[selectedDay] || [];
    dayLectures.forEach((lecture, index) => {
      items.push({
        ...lecture,
        endTime: calculateEndTime(lecture.time, lecture.duration),
        itemType: 'lecture',
        index,
        id: `lecture-${selectedDay}-${index}`
      });
    });

    const dayActivities = clubActivities[selectedDay] || [];
    dayActivities.forEach((activity, index) => {
      items.push({
        time: activity.time,
        subject: activity.name,
        location: activity.location,
        duration: activity.duration,
        travelTime: activity.travelTime,
        endTime: calculateEndTime(activity.time, activity.duration),
        type: 'club',
        itemType: 'activity',
        index,
        id: `activity-${selectedDay}-${index}`
      });
    });

    return items.sort((a, b) => a.time.localeCompare(b.time));
  };

  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleNoteChange = (itemId: string, note: string) => {
    setNotes(prev => ({
      ...prev,
      [itemId]: note
    }));
  };

  const handleDragStart = (e: React.DragEvent, item: any, index: number) => {
    setDraggedItem({ ...item, originalIndex: index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (!draggedItem || draggedItem.originalIndex === targetIndex) {
      setDraggedItem(null);
      return;
    }

    if (draggedItem.itemType === 'lecture') {
      const updatedSchedule = { ...subjectSchedule };
      const items = [...updatedSchedule[selectedDay]];
      const [movedItem] = items.splice(draggedItem.originalIndex, 1);
      items.splice(targetIndex, 0, movedItem);
      updatedSchedule[selectedDay] = items;
      setSubjectSchedule(updatedSchedule);
    } else if (draggedItem.itemType === 'activity') {
      const updatedActivities = { ...clubActivities };
      const items = [...updatedActivities[selectedDay]];
      const [movedItem] = items.splice(draggedItem.originalIndex, 1);
      items.splice(targetIndex, 0, movedItem);
      updatedActivities[selectedDay] = items;
      setClubActivities(updatedActivities);
    }

    setDraggedItem(null);
  };

  const moveLectureToDay = (lectureIndex: number, fromDay: string, toDay: string) => {
    if (fromDay === toDay) return;

    const lecture = subjectSchedule[fromDay][lectureIndex];
    
    const updatedFromDay = subjectSchedule[fromDay].filter((_, index) => index !== lectureIndex);
    const updatedToDay = [...(subjectSchedule[toDay] || []), lecture];

    setSubjectSchedule({
      ...subjectSchedule,
      [fromDay]: updatedFromDay,
      [toDay]: updatedToDay
    });
  };

  const addLecture = () => {
    if (newLecture.subject && newLecture.time && newLecture.location) {
      const updatedSchedule = {
        ...subjectSchedule,
        [selectedDay]: [
          ...subjectSchedule[selectedDay],
          { ...newLecture, type: 'lecture' as const, isExtra: true }
        ]
      };
      setSubjectSchedule(updatedSchedule);
      setNewLecture({ subject: '', time: '', location: '', duration: 60 });
      setShowAddLecture(false);
    }
  };

  const addClubActivity = () => {
    if (newActivity.name && newActivity.time && newActivity.location) {
      const updatedActivities = {
        ...clubActivities,
        [selectedDay]: [
          ...clubActivities[selectedDay] || [],
          { ...newActivity, travelTime: 5 }
        ]
      };
      setClubActivities(updatedActivities);
      setNewActivity({ name: '', time: '', location: '', duration: 30 });
      setShowAddActivity(false);
    }
  };

  const removeLecture = (index: number) => {
    const updatedSchedule = {
      ...subjectSchedule,
      [selectedDay]: subjectSchedule[selectedDay].filter((_, i) => i !== index)
    };
    setSubjectSchedule(updatedSchedule);
  };

  const removeClubActivity = (index: number) => {
    const updatedActivities = {
      ...clubActivities,
      [selectedDay]: clubActivities[selectedDay].filter((_, i) => i !== index)
    };
    setClubActivities(updatedActivities);
  };

  const getWeekOverview = () => {
    const overview: any = {};
    let totalLectures = 0;
    let totalClubTime = 0;
    let totalStudyTime = 0;
    const subjectsStudied = new Set();
    const clubsAttended = new Set();

    days.slice(0, 6).forEach(day => {
      const dayLectures = subjectSchedule[day]?.filter(item => item.type === 'lecture') || [];
      const dayActivities = clubActivities[day] || [];
      
      totalLectures += dayLectures.length;
      totalStudyTime += dayLectures.reduce((acc, lecture) => acc + lecture.duration, 0);
      totalClubTime += dayActivities.reduce((acc, activity) => acc + activity.duration, 0);
      
      dayLectures.forEach(lecture => subjectsStudied.add(lecture.subject));
      dayActivities.forEach(activity => clubsAttended.add(activity.name.split(' ')[0]));
      
      overview[day] = {
        lectures: dayLectures.length,
        lectureTime: dayLectures.reduce((acc, lecture) => acc + lecture.duration, 0),
        clubTime: dayActivities.reduce((acc, activity) => acc + activity.duration, 0),
        subjects: dayLectures.map(l => l.subject),
        clubs: dayActivities.map(a => a.name)
      };
    });

    return {
      daily: overview,
      weekly: {
        totalLectures,
        totalClubTime,
        totalStudyTime: Math.round(totalStudyTime / 60 * 10) / 10,
        subjectsStudied: Array.from(subjectsStudied),
        clubsAttended: Array.from(clubsAttended),
        averageDailyStudy: Math.round(totalStudyTime / 60 / 6 * 10) / 10
      }
    };
  };

  const getScheduleItemClasses = (type: string) => {
    const baseClasses = "group rounded-xl p-4 transition-all duration-300 hover:shadow-lg";
    switch (type) {
      case 'lecture':
        return `${baseClasses} schedule-lecture`;
      case 'club':
        return `${baseClasses} schedule-club`;
      case 'free':
        return `${baseClasses} schedule-free`;
      case 'break':
        return `${baseClasses} schedule-break`;
      default:
        return baseClasses;
    }
  };

  if (selectedDay === 'Sunday') {
    const overview = getWeekOverview();
    
    return (
      <div className="max-w-7xl mx-auto p-6 planner-bg min-h-screen">
        <div className="planner-card p-8 mb-6 border-purple-200 float-animation">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            📊 Weekly Overview
          </h1>
          <p className="text-muted-foreground text-xl">Your complete week at a glance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Weekly Stats */}
          <div className="planner-card p-8 border-blue-200 glow-pulse">
            <h2 className="text-3xl font-bold gradient-text mb-8 flex items-center">
              <TrendingUp className="mr-3" size={32} />
              Weekly Stats
            </h2>
            <div className="space-y-4">
              <div className="stats-card stats-blue">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Lectures</span>
                  <span className="text-2xl font-bold">{overview.weekly.totalLectures}</span>
                </div>
              </div>
              <div className="stats-card stats-green">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Study Hours</span>
                  <span className="text-2xl font-bold">{overview.weekly.totalStudyTime}h</span>
                </div>
              </div>
              <div className="stats-card stats-purple">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Club Hours</span>
                  <span className="text-2xl font-bold">{Math.round(overview.weekly.totalClubTime / 60 * 10) / 10}h</span>
                </div>
              </div>
              <div className="stats-card stats-orange">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Avg Daily Study</span>
                  <span className="text-2xl font-bold">{overview.weekly.averageDailyStudy}h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects Covered */}
          <div className="planner-card p-8 border-green-200 glow-pulse">
            <h2 className="text-3xl font-bold gradient-text mb-8 flex items-center">
              <BookOpen className="mr-3" size={32} />
              Subjects This Week
            </h2>
            <div className="space-y-3">
              {overview.weekly.subjectsStudied.map((subject: string, index: number) => (
                <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-800 font-medium">{subject}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Club Activities */}
          <div className="planner-card p-8 border-purple-200 glow-pulse">
            <h2 className="text-3xl font-bold gradient-text mb-8 flex items-center">
              <Award className="mr-3" size={32} />
              Clubs Attended
            </h2>
            <div className="space-y-3">
              {overview.weekly.clubsAttended.map((club: string, index: number) => (
                <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-800 font-medium">{club} Club</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="planner-card p-8 border-gray-200 float-animation">
              <h2 className="text-3xl font-bold gradient-text mb-8 flex items-center">
                <Calendar className="mr-3" size={32} />
                Daily Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {days.slice(0, 6).map(day => (
                  <div key={day} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">{day}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Lectures:</span>
                        <span className="font-semibold text-blue-600">{overview.daily[day].lectures}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Study Time:</span>
                        <span className="font-semibold text-green-600">{Math.round(overview.daily[day].lectureTime / 60 * 10) / 10}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Club Time:</span>
                        <span className="font-semibold text-purple-600">{Math.round(overview.daily[day].clubTime / 60 * 10) / 10}h</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <p className="text-xs text-gray-500 mb-1">Subjects:</p>
                        <div className="flex flex-wrap gap-1">
                          {overview.daily[day].subjects.slice(0, 3).map((subject: string, index: number) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {subject.split(' ')[0]}
                            </span>
                          ))}
                          {overview.daily[day].subjects.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{overview.daily[day].subjects.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setSelectedDay('Monday')}
            className="btn-primary text-xl"
          >
            ✨ Back to Schedule
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 planner-bg min-h-screen">
      {/* Header */}
      <div className="planner-card p-10 mb-8 border-purple-200 float-animation">
        <h1 className="text-6xl font-bold gradient-text mb-6">
          📚 My College Day Planner
        </h1>
        <p className="text-muted-foreground text-xl">Organize your academic life with style and efficiency ✨</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Schedule Area */}
        <div className="xl:col-span-3">
          {/* Day Selector */}
          <div className="planner-card p-8 mb-8 border-blue-200 glow-pulse">
            <h2 className="text-3xl font-bold gradient-text mb-8 flex items-center">
              <Calendar className="mr-4" size={32} />
              Select Day
            </h2>
            <div className="flex flex-wrap gap-4">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-filter backdrop-blur-10 border ${
                    selectedDay === day
                      ? 'btn-primary transform scale-110'
                      : 'bg-white/60 text-foreground border-white/30 hover:bg-white/80 hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Display */}
          <div className="planner-card border-gray-200 float-animation">
            <div className="p-8 border-b border-white/20">
              <h2 className="text-3xl font-bold gradient-text flex items-center">
                <Clock className="mr-4" size={32} />
                {selectedDay} Schedule ✨
              </h2>
            </div>
            <div className="h-96 overflow-y-auto p-8">
              <div className="space-y-3">
                {getAllScheduleItems().map((item, idx) => (
                  <div key={item.id}>
                    {dragOverIndex === idx && (
                      <div className="drop-zone" />
                    )}
                    <div
                      draggable={item.type !== 'break'}
                      onDragStart={(e) => item.type !== 'break' && handleDragStart(e, item, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, idx)}
                      className={`${getScheduleItemClasses(item.type)} ${
                        draggedItem?.id === item.id ? 'drag-preview' : 'hover:transform hover:scale-102'
                      } ${item.type !== 'break' ? 'cursor-move' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {item.type !== 'break' && (
                            <input
                              type="checkbox"
                              checked={checkedItems[item.id] || false}
                              onChange={() => toggleCheck(item.id)}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                {item.isExtra && (
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full mr-2 font-medium">
                                    Extra Lecture
                                  </span>
                                )}
                                <h3 className="font-bold text-gray-800 text-lg flex items-center">
                                  {item.type !== 'break' && <Move size={16} className="mr-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                  {item.subject}
                                </h3>
                              </div>
                              {item.type !== 'break' && (
                                <div className="relative">
                                  <button
                                    onClick={() => toggleDropdown(item.id)}
                                    className="p-2 rounded-full hover:bg-white hover:bg-opacity-50 transition-all duration-200"
                                  >
                                    <MoreVertical size={18} className="text-gray-600" />
                                  </button>
                                  {openDropdowns[item.id] && (
                                    <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-48">
                                      <button
                                        onClick={() => {
                                          if (item.itemType === 'lecture') {
                                            removeLecture(item.index);
                                          } else {
                                            removeClubActivity(item.index);
                                          }
                                          toggleDropdown(item.id);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center"
                                      >
                                        <X size={16} className="mr-2" />
                                        Remove
                                      </button>
                                      {item.itemType === 'lecture' && (
                                        <div className="border-t border-gray-200 mt-2 pt-2">
                                          <p className="px-4 py-1 text-sm text-gray-500 font-medium">Move to:</p>
                                          {days.filter(day => day !== selectedDay && day !== 'Sunday').map(day => (
                                            <button
                                              key={day}
                                              onClick={() => {
                                                moveLectureToDay(item.index, selectedDay, day);
                                                toggleDropdown(item.id);
                                              }}
                                              className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 flex items-center"
                                            >
                                              <Calendar size={16} className="mr-2" />
                                              {day}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-2 space-x-4">
                              <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {formatTime(item.time)} - {formatTime(item.endTime)}
                              </span>
                              <span className="flex items-center">
                                <MapPin size={14} className="mr-1" />
                                {item.location}
                                {item.travelTime && (
                                  <span className="ml-1 text-xs bg-gray-200 px-2 py-1 rounded-full">
                                    {item.travelTime} min walk
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes Section */}
                      {item.type === 'lecture' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Notes:</span>
                            {editingNote === item.id ? (
                              <button
                                onClick={() => setEditingNote(null)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => setEditingNote(item.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit3 size={16} />
                              </button>
                            )}
                          </div>
                          {editingNote === item.id ? (
                            <textarea
                              value={notes[item.id] || ''}
                              onChange={(e) => handleNoteChange(item.id, e.target.value)}
                              placeholder="Add notes about homework, key learnings, etc..."
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={3}
                            />
                          ) : (
                            <div className="min-h-12 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                              {notes[item.id] || 'Click edit to add notes about this lecture...'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Add New Lecture */}
          <div className="planner-card p-8 border-blue-200 glow-pulse">
            <button
              onClick={() => setShowAddLecture(!showAddLecture)}
              className="w-full btn-primary"
            >
              <Plus size={20} className="mr-2" />
              {showAddLecture ? '✖️ Cancel' : '📚 Add Extra Lecture'}
              {showAddLecture ? <ChevronUp size={20} className="ml-2" /> : <ChevronDown size={20} className="ml-2" />}
            </button>
            
            {showAddLecture && (
              <div className="mt-6 space-y-4 animate-fade-in">
                <select
                  value={newLecture.subject}
                  onChange={(e) => setNewLecture({...newLecture, subject: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>• {subject}</option>
                  ))}
                </select>
                <input
                  type="time"
                  value={newLecture.time}
                  onChange={(e) => setNewLecture({...newLecture, time: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newLecture.location}
                  onChange={(e) => setNewLecture({...newLecture, location: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addLecture}
                  className="w-full btn-success"
                >
                  Add Lecture
                </button>
              </div>
            )}
          </div>

          {/* Add New Club Activity */}
          <div className="planner-card p-8 border-green-200 glow-pulse">
            <button
              onClick={() => setShowAddActivity(!showAddActivity)}
              className="w-full btn-success"
            >
              <Plus size={20} className="mr-2" />
              {showAddActivity ? '✖️ Cancel' : '🎯 Add Club Activity'}
              {showAddActivity ? <ChevronUp size={20} className="ml-2" /> : <ChevronDown size={20} className="ml-2" />}
            </button>
            
            {showAddActivity && (
              <div className="mt-6 space-y-4 animate-fade-in">
                <input
                  type="text"
                  placeholder="Activity name"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({...newActivity, time: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newActivity.location}
                  onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <select
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity({...newActivity, duration: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
                <button
                  onClick={addClubActivity}
                  className="w-full btn-primary"
                >
                  Add Activity
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="planner-card p-8 border-purple-200 float-animation">
            <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center">
              <Target className="mr-3" size={24} />
              {selectedDay} Overview 📊
            </h2>
            <div className="space-y-3">
              <div className="stats-card stats-blue">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lectures:</span>
                  <span className="font-bold">{subjectSchedule[selectedDay]?.filter(item => item.type === 'lecture').length || 0}</span>
                </div>
              </div>
              <div className="stats-card stats-green">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Club Activities:</span>
                  <span className="font-bold">{(clubActivities[selectedDay] || []).length}</span>
                </div>
              </div>
              <div className="stats-card stats-yellow">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Free Slots:</span>
                  <span className="font-bold">{subjectSchedule[selectedDay]?.filter(item => item.type === 'free').length || 0}</span>
                </div>
              </div>
              <div className="stats-card stats-purple">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Completed:</span>
                  <span className="font-bold">
                    {Object.keys(checkedItems).filter(key => key.includes(selectedDay) && checkedItems[key]).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDayPlanner;