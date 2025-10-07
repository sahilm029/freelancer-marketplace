"use client";

// This single file contains the complete, interactive frontend prototype for the freelancer Marketplace.
// It is designed to start with NO MOCK DATA, allowing you to populate the platform from a blank slate.
// It uses React Hooks to manage state and simulate a full user experience in a Next.js project.

import React, { useState, useEffect } from 'react';
import { Search, Briefcase, User, Star, MessageSquare, DollarSign, ArrowLeft, LogOut, CheckCircle, XCircle, PlusCircle, Award, Edit } from 'lucide-react';

// --- TYPE DEFINITIONS ---
/**
 * @typedef {'Client' | 'Freelancer'} UserRole
 */
/**
 * @typedef {object} User
 * @property {number} id
 * @property {string} name
 * @property {UserRole} role
 * @property {string} [title]
 * @property {string} avatarUrl
 * @property {number} [rating]
 */
/**
 * @typedef {object} Project
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {number} budget
 * @property {string[]} skills
 * @property {number} clientId
 * @property {'Open' | 'In Progress' | 'Completed'} status
 * @property {number | null} hiredFreelancerId
 */
/** @typedef {object} Bid
 * @property {number} id
 * @property {number} projectId
 * @property {number} freelancerId
 * @property {number} bidAmount
 * @property {string} proposalText
 */
/** @typedef {object} Review
 * @property {number} id
 * @property {number} projectId
 * @property {number} freelancerId
 * @property {number} rating
 * @property {string} comment
 */


// --- EMPTY INITIAL DATABASE ---
// The application starts with no data. All users, projects, etc., will be created through the UI.
const initialUsers = [];
const initialProjects = [];
const initialBids = [];
const initialReviews = [];

// --- UI COMPONENTS ---
const Header = ({ setView, currentUser, onLogout, onShowAuth }) => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
      <div onClick={() => setView('home')} className="font-bold text-2xl text-purple-700 cursor-pointer">freelancer</div>
      <div className="flex items-center space-x-4">
        <button onClick={() => setView('projects')} className="text-gray-600 hover:text-purple-700">Browse Projects</button>
        {currentUser?.role === 'Client' && (
           <button onClick={() => setView('postProject')} className="text-gray-600 hover:text-purple-700 flex items-center">
             <PlusCircle size={18} className="mr-1" /> Post Project
           </button>
        )}
        {currentUser ? (
          <>
            <button onClick={() => setView('dashboard')} className="font-semibold text-gray-700 hover:text-purple-700">{currentUser.name}</button>
            <button onClick={onLogout} className="text-gray-500 hover:text-purple-700"><LogOut size={20} /></button>
          </>
        ) : (
          <button onClick={onShowAuth} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Login / Sign Up</button>
        )}
      </div>
    </nav>
  </header>
);

const ProjectCard = ({ project, setView, setSelectedProjectId }) => (
    <div
        onClick={() => { setSelectedProjectId(project.id); setView('projectDetail'); }}
        className="bg-white border rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
    >
        <div>
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-800 pr-4">{project.title}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${project.status === 'Open' ? 'bg-green-100 text-green-800' : project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{project.status}</span>
            </div>
            <p className="text-gray-500 mt-2 text-sm line-clamp-2">{project.description}</p>
        </div>
        <div className="mt-4">
            <div className="mt-4">
              <span className="font-semibold text-purple-700 text-lg">${project.budget.toLocaleString()}</span>
              <span className="text-gray-500 text-sm"> / budget</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.skills.map(skill => (
                <span key={skill} className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">{skill}</span>
              ))}
            </div>
        </div>
    </div>
);

const AuthModal = ({ onLogin, onSignUp, onCancel, users }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    
    const handleSignUp = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const role = formData.get('role');
        
        if (!name || !role) {
            alert('Please fill out all fields.');
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            role,
            avatarUrl: `https://placehold.co/150/22c55e/ffffff?text=${name.substring(0,2).toUpperCase()}`,
            title: role === 'Freelancer' ? 'New Freelancer' : undefined,
            rating: role === 'Freelancer' ? 0 : undefined,
        };
        onSignUp(newUser);
    }
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">{isLoginView ? 'Login to freelancer' : 'Create an Account'}</h2>
          
          {isLoginView ? (
            <div>
              <p className="text-center text-sm text-gray-600 mb-6">Select a user to simulate logging in:</p>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {users.length > 0 ? users.map(user => (
                  <button key={user.id} onClick={() => onLogin(user)} className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-100">
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-4 text-left">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </button>
                )) : <p className="text-center text-gray-500">No users yet. Please sign up.</p>}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" name="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                </div>
                <div>
                     <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a...</label>
                     <select id="role" name="role" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3">
                        <option value="Client">Client (I want to hire)</option>
                        <option value="Freelancer">Freelancer (I want to work)</option>
                     </select>
                </div>
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700">Sign Up</button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button onClick={() => setIsLoginView(!isLoginView)} className="text-sm text-purple-600 hover:underline">
              {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
          <button onClick={onCancel} className="w-full mt-4 text-center text-gray-600 text-sm hover:underline">Cancel</button>
        </div>
      </div>
    );
};

const ReviewModal = ({ project, freelancer, onAddReview, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }
        onAddReview({
            id: Date.now(),
            projectId: project.id,
            freelancerId: freelancer.id,
            rating,
            comment,
        });
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-2">Leave a Review for {freelancer.name}</h2>
                <p className="text-gray-600 mb-6">Project: {project.title}</p>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                                key={star}
                                size={32}
                                className={`cursor-pointer ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                    <textarea 
                        id="comment" 
                        rows={4} 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onCancel} className="text-gray-600">Cancel</button>
                    <button type="submit" className="bg-purple-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-purple-700">Submit Review</button>
                </div>
            </form>
        </div>
    );
};


const HomeView = ({ setView }) => (
  <>
    <div className="bg-white">
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800">Where Great Projects Begin.</h1>
        <p className="mt-4 text-xl text-gray-600">Hire expert freelancers for any job, online.</p>
        <button onClick={() => setView('projects')} className="mt-8 bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-700 transition-colors">
          Browse All Projects
        </button>
      </div>
    </div>
  </>
);

const ProjectsView = ({ setView, setSelectedProjectId, projects }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Next Project</h1>
        <div className="relative mb-8">
            <input 
                type="text" 
                placeholder="Search for projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 border rounded-lg" 
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} setView={setView} setSelectedProjectId={setSelectedProjectId} />
              ))}
            </div>
        ) : (
            <div className="text-center text-gray-500 py-16 border-dashed border-2 rounded-lg">
                <Briefcase size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold">No Projects Found</h3>
                <p>It looks like no projects have been posted yet. Log in as a client to post the first one!</p>
            </div>
        )}
      </div>
    );
};

const ProjectDetailView = ({ projectId, setView, currentUser, users, projects, bids, addBid, onHire }) => {
  const project = projects.find(p => p.id === projectId);
  const client = users.find(u => u.id === project?.clientId);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!project || !client) return <div>Project not found.</div>;
  
  const projectBids = bids.filter(b => b.projectId === projectId);
  const isClientOwner = currentUser?.role === 'Client' && currentUser.id === project.clientId;
  
  const hasAlreadyBid = currentUser ? projectBids.some(b => b.freelancerId === currentUser.id) : false;

  const handleSubmitBid = (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'Freelancer') {
        alert("Please log in as a freelancer to submit a bid.");
        return;
    }
    const formData = new FormData(e.target);
    const newBid = {
        id: Date.now(),
        projectId: project.id,
        freelancerId: currentUser.id,
        bidAmount: Number(formData.get('bid')),
        proposalText: formData.get('proposal'),
    };
    addBid(newBid);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    e.target.reset();
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <button onClick={() => setView('projects')} className="flex items-center text-purple-700 hover:underline mb-8">
        <ArrowLeft size={18} className="mr-2" /> Back to All Projects
      </button>
      <div className="lg:flex lg:space-x-12">
        <div className="lg:w-2/3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block ${project.status === 'Open' ? 'bg-green-100 text-green-800' : project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{project.status}</span>
          <h1 className="text-4xl font-bold text-gray-800">{project.title}</h1>
          <div className="flex flex-wrap gap-2 my-4">
            {project.skills.map(skill => (
              <span key={skill} className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">{skill}</span>
            ))}
          </div>
          <p className="text-gray-600 mt-4 leading-relaxed">{project.description}</p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Proposals ({projectBids.length})</h2>
          <div className="space-y-6">
            {projectBids.map(bid => {
              const freelancer = users.find(u => u.id === bid.freelancerId);
              return (
                <div key={bid.id} className="bg-white border rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <img src={freelancer?.avatarUrl} alt={freelancer?.name} className="w-12 h-12 rounded-full" />
                      <div className="ml-4">
                        <p className="font-bold text-gray-800">{freelancer?.name}</p>
                        <p className="text-sm text-gray-500">{freelancer?.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-purple-700">${bid.bidAmount.toLocaleString()}</p>
                      {freelancer?.rating > 0 && 
                        <div className="flex items-center text-sm text-yellow-500 mt-1 justify-end">
                            <Star size={16} className="mr-1" /> {freelancer?.rating}
                        </div>
                      }
                    </div>
                  </div>
                  <p className="text-gray-600 my-4">{bid.proposalText}</p>
                  {isClientOwner && project.status === 'Open' && (
                    <button onClick={() => onHire(project.id, bid.freelancerId)} className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700">Accept & Hire</button>
                  )}
                </div>
              );
            })}
             {projectBids.length === 0 && <div className="text-center text-gray-500 py-8 border-dashed border-2 rounded-lg">Be the first to submit a proposal!</div>}
          </div>
        </div>

        <div className="lg:w-1/3 mt-12 lg:mt-0">
            <div className="bg-white border rounded-lg p-6 sticky top-24">
                 <div className="mt-6 border-t pt-4">
                    <p className="font-bold text-gray-800">Project Budget</p>
                    <p className="text-3xl font-extrabold text-purple-700">${project.budget.toLocaleString()}</p>
                </div>
                {currentUser?.role === 'Freelancer' && project.status === 'Open' && !hasAlreadyBid && (
                    <form onSubmit={handleSubmitBid} className="mt-6 border-t pt-6">
                        <h3 className="font-bold text-lg mb-4">Submit Your Proposal</h3>
                        <div>
                            <label htmlFor="bid" className="block text-sm font-medium text-gray-700">Your Bid Amount ($)</label>
                            <input type="number" id="bid" name="bid" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="proposal" className="block text-sm font-medium text-gray-700">Cover Letter</label>
                            <textarea id="proposal" name="proposal" rows={4} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                        </div>
                        <button type="submit" className="mt-6 w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700">Submit Proposal</button>
                        {showSuccess && <p className="text-green-600 text-center mt-4 text-sm flex items-center justify-center"><CheckCircle size={16} className="mr-2"/> Proposal submitted!</p>}
                    </form>
                )}
                {hasAlreadyBid && (
                    <div className="mt-6 border-t pt-6 text-center text-green-600 bg-green-50 p-4 rounded-lg">
                        <CheckCircle className="mx-auto mb-2" />
                        <p className="font-semibold">You have already submitted a proposal for this project.</p>
                    </div>
                )}
                {project.status !== 'Open' && (
                     <div className="mt-6 border-t pt-6 text-center text-gray-600 bg-gray-100 p-4 rounded-lg">
                        <p className="font-semibold">This project is no longer accepting proposals.</p>
                    </div>
                )}
                {!currentUser && project.status === 'Open' && (
                    <div className="mt-6 border-t pt-6 text-center text-gray-600">
                        <p>Please log in as a Freelancer to submit a proposal.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ currentUser, projects, setView, setSelectedProjectId, onCompleteProject, onReviewProject }) => {
    if (!currentUser) return <div className="text-center p-12">Please log in to see your dashboard.</div>;

    const myProjects = currentUser.role === 'Client' ? projects.filter(p => p.clientId === currentUser.id) : projects.filter(p => p.hiredFreelancerId === currentUser.id);

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex items-center mb-8">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-20 h-20 rounded-full" />
                <div className="ml-6">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome, {currentUser.name}</h1>
                    <p className="text-xl text-gray-500">{currentUser.title || currentUser.role}</p>
                </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">My Projects</h2>
             <div className="bg-white p-6 rounded-lg border">
                <div className="space-y-4">
                    {myProjects.length > 0 ? myProjects.map(p => (
                        <div key={p.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                             <div className="flex justify-between items-center">
                                <div>
                                    <p onClick={() => { setSelectedProjectId(p.id); setView('projectDetail'); }} className="font-bold hover:underline cursor-pointer">{p.title}</p>
                                    <p className={`text-sm mt-1 font-semibold ${p.status === 'Open' ? 'text-green-600' : p.status === 'In Progress' ? 'text-blue-600' : 'text-gray-600'}`}>{p.status}</p>
                                </div> 
                                <div className="flex items-center space-x-4">
                                     <span className="text-lg font-semibold text-purple-700">${p.budget.toLocaleString()}</span>
                                     {currentUser.role === 'Client' && p.status === 'In Progress' && (
                                         <button onClick={() => onCompleteProject(p.id)} className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600">Mark Complete</button>
                                     )}
                                     {currentUser.role === 'Client' && p.status === 'Completed' && (
                                         <button onClick={() => onReviewProject(p)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600">Leave Review</button>
                                     )}
                                </div>
                             </div>
                        </div>
                    )) : <p className="text-gray-500">You have no projects yet.</p>}
                </div>
            </div>
        </div>
    );
}

const PostProjectView = ({ addProject, setView, currentUser }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newProject = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            budget: Number(formData.get('budget')),
            skills: formData.get('skills').split(',').map(s => s.trim()),
            clientId: currentUser.id,
            status: 'Open',
            hiredFreelancerId: null,
        };
        addProject(newProject);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setView('projects');
        }, 2000);
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Post a New Project</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Project Title</label>
                    <input type="text" id="title" name="title" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Project Description</label>
                    <textarea id="description" name="description" rows={5} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"></textarea>
                </div>
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget ($)</label>
                    <input type="number" id="budget" name="budget" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                </div>
                 <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Required Skills (comma separated)</label>
                    <input type="text" id="skills" name="skills" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                </div>
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700">Post Project</button>
                 {showSuccess && <p className="text-green-600 text-center mt-4 text-sm flex items-center justify-center"><CheckCircle size={16} className="mr-2"/> Project posted successfully!</p>}
            </form>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState('home'); 
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [reviewModalData, setReviewModalData] = useState(null); 
  
  const [users, setUsers] = useState(initialUsers);
  const [projects, setProjects] = useState(initialProjects);
  const [bids, setBids] = useState(initialBids);
  const [reviews, setReviews] = useState(initialReviews);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
  };

  const handleSignUp = (newUser) => {
      setUsers(prevUsers => [newUser, ...prevUsers]);
      setCurrentUser(newUser);
      setAuthModalOpen(false);
      alert(`Welcome, ${newUser.name}! Your account has been created.`);
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  const addBid = (newBid) => {
    setBids(prevBids => [newBid, ...prevBids]);
  }
  
  const addProject = (newProject) => {
    setProjects(prevProjects => [newProject, ...prevProjects]);
  }

  const handleHire = (projectId, freelancerId) => {
      setProjects(prevProjects => prevProjects.map(p => 
          p.id === projectId ? { ...p, status: 'In Progress', hiredFreelancerId: freelancerId } : p
      ));
      alert(`Hired successfully! The project is now In Progress.`);
      setView('dashboard');
  }

  const handleCompleteProject = (projectId) => {
      setProjects(prevProjects => prevProjects.map(p => 
          p.id === projectId ? { ...p, status: 'Completed' } : p
      ));
  }

  const handleAddReview = (newReview) => {
      setReviews(prev => [newReview, ...prev]);
      const freelancerReviews = [...reviews, newReview].filter(r => r.freelancerId === newReview.freelancerId);
      const totalRating = freelancerReviews.reduce((acc, r) => acc + r.rating, 0);
      const newAverage = totalRating / freelancerReviews.length;
      setUsers(prevUsers => prevUsers.map(u => 
          u.id === newReview.freelancerId ? { ...u, rating: parseFloat(newAverage.toFixed(1)) } : u
      ));
      setReviewModalData(null);
      alert('Review submitted, thank you!');
  }

  const renderView = () => {
    switch (view) {
      case 'projects':
        return <ProjectsView setView={setView} setSelectedProjectId={setSelectedProjectId} projects={projects}/>;
      case 'projectDetail':
        if (selectedProjectId) {
          return <ProjectDetailView projectId={selectedProjectId} setView={setView} currentUser={currentUser} users={users} projects={projects} bids={bids} addBid={addBid} onHire={handleHire} />;
        }
        return <ProjectsView setView={setView} setSelectedProjectId={setSelectedProjectId} projects={projects} />;
      case 'dashboard':
        return <DashboardView currentUser={currentUser} projects={projects} setView={setView} setSelectedProjectId={setSelectedProjectId} onCompleteProject={handleCompleteProject} onReviewProject={(p) => setReviewModalData({project:p, freelancer: users.find(u=>u.id === p.hiredFreelancerId)})} />;
      case 'postProject':
        return <PostProjectView addProject={addProject} setView={setView} currentUser={currentUser} />;
      case 'home':
      default:
        return <HomeView setView={setView} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header setView={setView} currentUser={currentUser} onLogout={handleLogout} onShowAuth={() => setAuthModalOpen(true)} />
      <main>
        {renderView()}
      </main>
      {isAuthModalOpen && <AuthModal onLogin={handleLogin} onSignUp={handleSignUp} onCancel={() => setAuthModalOpen(false)} users={users} />}
      {reviewModalData && <ReviewModal project={reviewModalData.project} freelancer={reviewModalData.freelancer} onAddReview={handleAddReview} onCancel={() => setReviewModalData(null)} />}
    </div>
  );
}
