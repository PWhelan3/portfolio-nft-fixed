import React from 'react';
import { ChevronRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="pt-16">
      {/* Hero Section with Text */}
      <div className="bg-slate-900 py-20">
        <div className="container mx-auto px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Blockchain and <span className="text-blue-400">Web3</span> Developer
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mb-8">
            With a passion for Art, Software, and Web3 Technologies I am building and learning how to create engaging and powerful applications using blockchain based technology to create meaningful experiments!
          </p>
        </div>
      </div>

      {/* Location Section - Simplified without MapBox */}
      <div className="bg-slate-900 py-16">
        <div className="container mx-auto px-8">
          <h2 className="text-2xl font-bold text-white mb-6">Location</h2>
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🇮🇪</div>
            <h3 className="text-xl font-bold text-white mb-2">Dublin, Ireland</h3>
            <p className="text-slate-300">Based in the heart of Europe's tech scene</p>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-slate-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Recent Projects</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Current: Blockchain NFT Platform",
                description: "Built with React, Solidity, and Wagmi. Features simple NFT minting with IPFS storage via Pinata for portfolio showcase.",
                image: "/CurrentMap.png",
                tech: ["Solidity", "React", "Sepolia", "Hardhat", "Pinata", "Metamask", "Wagmi"],
                link: "https://badproject.vercel.app/"
              },
              {
                title: "Fitness Activity App", 
                description: "Simple Java Application run in the terminal to suggest fitness activities based on a variety of user inputs, like weather, location, temperature, UV index etc.",
                image: "/app1.png",
                tech: ["Java", "VS Code", "GitHub"],
                link: "https://github.com/PWhelan3/WeatherApp"
              },
              {
                title: "E-Store for Lamps",
                description: "A GitHub hosted simple frontend site to showcase our learning for web development. Includes a light/dark mode and state changes, as well as item pages and a shopping cart.",
                image: "/lampShop.png",
                tech: ["HTML", "JavaScript", "CSS", "Github Pages"],
                link: "https://html-preview.github.io/?url=https://github.com/PWhelan3/thelampshop/blob/main/index.html"
              }
            ].map((project, index) => (
              <div key={index} className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-all group">
                {/* Image container */}
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl text-white" style={{display: 'none'}}>
                    {project.title.charAt(0)}
                  </div>
                </div>
                
                {/* Content container */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-slate-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map(tech => (
                      <span key={tech} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-sm rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Individual project link */}
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-400 group-hover:text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    <span className="text-sm">View Project</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;