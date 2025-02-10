import React from "react";
import shareGoal from "../../assests/shareGoal.jpg";
import findPerfect from "../../assests/findTutor.jpeg";
import learnBegin from "../../assests/interactiveLearn.png";
import trustedParent from "../../assests/trustedParent.png";
import helptoGrow from "../../assests/helpTeam.png";
import intereativeLearn from "../../assests/interactiveLearn.png";
function LearningSteps() {
  return (
    <>
      <div class="w-full px-5 py-24 bg-gradient-to-r from-gray-50 to-gray-100">
        <div class="text-center mb-10">
          <h1 class="sm:text-5xl text-5xl font-bold title-font text-teal-700 mb-2">
            Start learning in 3 steps
          </h1>
        </div>
        <div class="flex flex-wrap justify-center gap-6 ">
          <div class="w-80 flex flex-col text-center items-center rounded-lg shadow-lg p-6 shadow-slate-400 transition-transform duration-300 ease-in-out hover:translate-y-[-10px]">
            <div class="w-44 h-44 bg-yellow-200 rounded-full flex items-center justify-center overflow-hidden mb-4">
              <img
                src={shareGoal}
                alt="Share your goals"
                class="w-full h-full object-cover"
              />
            </div>
            <h2 class="text-teal-700 text-2xl font-bold mb-3">
              Share your goals
            </h2>
            <p class="text-gray-700 leading-relaxed text-md">
              Let us know what type of tutoring you need and when, so we can
              find you the right matches for your needs.
            </p>
          </div>

          <div class="w-80 flex flex-col text-center items-center rounded-lg shadow-lg p-6 shadow-slate-400 transition-transform duration-300 ease-in-out hover:translate-y-[-10px]">
            <div class="w-44 h-44 bg-teal-200 rounded-full flex items-center justify-center overflow-hidden mb-4">
              <img
                src={findPerfect}
                alt="Find the perfect fit"
                class="w-full h-full object-cover"
              />
            </div>
            <h2 class="text-teal-700 text-2xl font-bold mb-3">
              Find the perfect fit
            </h2>
            <p class="text-gray-700 leading-relaxed text-md">
              Browse our tutors, get in touch, and book as many free meetings as
              you need to find the tutor they click with most.
            </p>
          </div>

          <div class="w-80 flex flex-col text-center items-center rounded-lg shadow-lg p-6 shadow-slate-400 transition-transform duration-300 ease-in-out hover:translate-y-[-10px]">
            <div class="w-44 h-44 bg-pink-200 rounded-full flex items-center justify-center overflow-hidden mb-4">
              <img
                src={learnBegin}
                alt="Let the learning begin"
                class="w-full h-full object-cover"
              />
            </div>
            <h2 class="text-teal-700 text-2xl font-bold mb-3">
              Let the learning begin
            </h2>
            <p class="text-gray-700 leading-relaxed text-md">
              Once you’ve found the right fit, it’s time to book your lessons
              and start learning with us.
            </p>
          </div>
        </div>
      </div>

      <section class="text-gray-600 body-font bg-gradient-to-r from-gray-50 to-gray-100">
        <div class="w-10/12 mx-auto flex px-5 py-5 md:flex-row flex-col items-center">
          <div class="lg:flex-grow md:w-1/2 flex flex-col md:items-start md:text-left items-center text-center order-2 md:order-none">
            <h1 class="title-font sm:text-5xl text-4xl mb-4 font-bold text-teal-700">
              Trusted by parents & teachers
            </h1>
            <p class="w-10/12 mb-8 leading-relaxed  font-medium text-black">
              MyTutor is the UK's most trusted tutoring platform by parents.
              We're rated 4.96/5 by students and parents from the 3.8 million
              (and counting!) lessons we’ve delivered so far.And because our
              tutors get such good results, schools use them to support their
              teaching. We work with 1500 across the UK, targeting learning gaps
              and helping teens everywhere achieve their goals.
            </p>
          </div>
          <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 order-1 md:order-none">
            <img
              className="w-full h-auto max-w-[720px] max-h-[600px] object-cover object-center rounded"
              alt="hero"
              src={trustedParent}
            />
          </div>
        </div>

        <div class="w-10/12  mx-auto flex px-5 py-5 md:flex-row flex-col items-center">
          <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 order-1 md:order-none">
            <img
              className="w-full h-auto max-w-[720px] max-h-[600px] object-cover object-center rounded"
              alt="hero"
              src={helptoGrow}
            />
          </div>
          <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 class="title-font sm:text-5xl text-4xl mb-4 font-bold text-teal-700">
              Help from our team, every step of the way
            </h1>
            <p class="w-10/12 mb-8 leading-relaxed  font-medium text-black">
              Our expert tutor-matching team can pair your child with the
              perfect tutor for their needs - from subject and level, right down
              to exam board and personality match. They’re always on hand to
              listen, answer questions and give you the tailored support you
              need.
            </p>
          </div>
        </div>
        <div class="w-10/12 mx-auto flex px-5 py-5 md:flex-row flex-col items-center">
          <div class="lg:flex-grow md:w-1/2 flex flex-col md:items-start md:text-left items-center text-center order-2 md:order-none">
            <h1 class="title-font sm:text-5xl text-4xl mb-4 font-bold text-teal-700 leading-normal">
              Our interactive learning space makes lessons engaging
            </h1>
            <p class="w-10/12 mb-8 leading-relaxed  font-medium text-black">
              Lessons are much more than a video call. They all happen in our
              tailor-made, interactive lesson space. So tutors can bring tricky
              concepts to life with interactive exercises, draw diagrams as they
              go, plus annotate homework and practice questions together. It can
              even make dreaded subjects - dare we say it - fun.
            </p>
          </div>

          <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 order-1 md:order-none">
            <img
              className="w-full h-auto max-w-[720px] max-h-[600px] object-cover object-center rounded"
              alt="hero"
              src={intereativeLearn}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default LearningSteps;
