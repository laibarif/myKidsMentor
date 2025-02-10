import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import LearningSteps from "./LearningSteps";

import FrequentQuestions from "./FrequentQuestions";

function LandingPage() {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100">
      <Header />
      <LearningSteps />
      <FrequentQuestions />
      <Footer />
    </div>
  );
}

export default LandingPage;
