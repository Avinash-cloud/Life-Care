import React from 'react';
import AssessmentDetail from './AssessmentDetail';

/**
 * AnxietyTest now delegates to the zero-scroll AssessmentDetail engine
 * configured with defaultId="anxiety" for 100% unified, responsive clinical screening.
 */
const AnxietyTest = () => {
  return <AssessmentDetail defaultId="anxiety" />;
};

export default AnxietyTest;
