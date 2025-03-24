// import React from 'react';
// import { useParams } from 'react-router-dom';
// import quizData from '../data/quizData.json';
// import VideoScreen from './VideoScreen';

// export default function ModuleScreen() {
//   const { moduleId } = useParams();
//   const moduleData = quizData.find((module) => String(module.id) === moduleId);

//   if (!moduleData) {
//     return <h2>Module not found</h2>;
//   }

//   return <VideoScreen videoUrl={moduleData.videoUrl} quizData={moduleData.quiz} title={moduleData.title} />;
// }

