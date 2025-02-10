import React, { useState } from 'react';

function Recomendation() {
  // Initialize the current page index
  const [currentPage, setCurrentPage] = useState(0);

  // Array of data for the items to be displayed
  const items = [
    {
      title: "Raclette Blueberry Nextious Level 1",
      description: "Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.",
    },
    {
      title: "Raclette Blueberry Nextious Level 2",
      description: "Sriracha leggings jianbing microdosing tousled waistcoat.",
    },
    {
      title: "Raclette Blueberry Nextious Level 3",
      description: "Cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.",
    },
    {
      title: "Raclette Blueberry Nextious Level 4",
      description: "Fam kinfolk cold-pressed sriracha leggings jianbing microdosing.",
    },
    {
      title: "Raclette Blueberry Nextious Level 5",
      description: "Tousled waistcoat photo booth kinfolk cold-pressed sriracha leggings.",
    },
    {
      title: "Raclette Blueberry Nextious Level 6",
      description: "Cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.",
    },
    {
      title: "Raclette Blueberry Nextious Level 7",
      description: "Fam kinfolk cold-pressed sriracha leggings jianbing microdosing.",
    },
    {
        title: "Raclette Blueberry Nextious Level 7",
        description: "Fam kinfolk cold-pressed sriracha leggings jianbing microdosing.",
      },
      {
          title: "Raclette Blueberry Nextious Level 7",
          description: "Fam kinfolk cold-pressed sriracha leggings jianbing microdosing.",
        }
        ,
    {
        title: "Raclette Blueberry Nextious Level 7",
        description: "Fam kinfolk cold-pressed sriracha leggings jianbing microdosing.",
      }
      ,
    {
        title: "Raclette Blueberry Nextious Level 7",
        description: "Fam kinfolk cold-pressed sriracha leggings jianbing microdosing.",
      }
      ,
    {
        title: "Raclette Blueberry Nextious Level 7",
        description: "Fam kinfolk cold-pressed sriracha leggings jianbing microdosing.",
      }
  ];

  // Calculate the items to show based on the current page
  const itemsPerPage = 3;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Go to the next page
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages); // Loop back to first page when reaching the end
  };

  // Go to the previous page
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages); // Loop to the last page when going back
  };

  return (
    <section className="text-gray-600 body-font">
      {/* Navigation Arrows Above the Component */}
      

      <div className="w-8/12 px-5 py-24 mx-auto">
        <div className="text-center mb-20">
          <h1 className="sm:text-5xl text-5xl font-bold title-font text-gray-900 mb-4">FeedBacks</h1>
        </div>
        <div className="flex justify-end space-x-4 mb-4">
        <button
          onClick={prevPage}
          className="bg-gray-900 text-white p-6 rounded-full hover:bg-gray-700 text-4xl  w-10 h-10 flex items-center justify-center"
        >
          ←
        </button>
        <button
          onClick={nextPage}
          className="bg-gray-900 text-white p-6 rounded-full hover:bg-gray-700 text-4xl  w-10 h-10 flex items-center justify-center"
        >
          →
        </button>
      </div>
        <div className="w-full grid grid-cols-3 gap-4 mx-auto">
        
          {currentItems.map((item, index) => (
            <div key={index} className="p-4">
              <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-20 rounded-lg overflow-hidden text-center relative">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
                <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">{item.title}</h1>
                <p className="leading-relaxed mb-3">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Recomendation;
