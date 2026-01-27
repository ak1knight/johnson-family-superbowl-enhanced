'use client'

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface TeamTheme {
    name: string;
    value: string;
    conference: 'AFC' | 'NFC';
    division: 'East' | 'North' | 'South' | 'West';
}

const NFL_TEAMS: TeamTheme[] = [
    // AFC East
    { name: 'New England Patriots', value: 'nepatriots', conference: 'AFC', division: 'East' },
    { name: 'Miami Dolphins', value: 'miamidolphins', conference: 'AFC', division: 'East' },
    { name: 'Buffalo Bills', value: 'buffalobills', conference: 'AFC', division: 'East' },
    { name: 'New York Jets', value: 'nyjets', conference: 'AFC', division: 'East' },

    // AFC North
    { name: 'Baltimore Ravens', value: 'baltimoreravens', conference: 'AFC', division: 'North' },
    { name: 'Pittsburgh Steelers', value: 'pittsburghsteelers', conference: 'AFC', division: 'North' },
    { name: 'Cleveland Browns', value: 'clevelandbrowns', conference: 'AFC', division: 'North' },
    { name: 'Cincinnati Bengals', value: 'cincinnatibengals', conference: 'AFC', division: 'North' },

    // AFC South
    { name: 'Indianapolis Colts', value: 'indianapoliscolts', conference: 'AFC', division: 'South' },
    { name: 'Tennessee Titans', value: 'tennesseetitans', conference: 'AFC', division: 'South' },
    { name: 'Houston Texans', value: 'houstontexans', conference: 'AFC', division: 'South' },
    { name: 'Jacksonville Jaguars', value: 'jacksonvillejaguars', conference: 'AFC', division: 'South' },

    // AFC West
    { name: 'Kansas City Chiefs', value: 'kcchiefs', conference: 'AFC', division: 'West' },
    { name: 'Denver Broncos', value: 'denverbroncos', conference: 'AFC', division: 'West' },
    { name: 'Las Vegas Raiders', value: 'lvraiders', conference: 'AFC', division: 'West' },
    { name: 'Los Angeles Chargers', value: 'lachargers', conference: 'AFC', division: 'West' },

    // NFC East
    { name: 'Dallas Cowboys', value: 'dallascowboys', conference: 'NFC', division: 'East' },
    { name: 'Philadelphia Eagles', value: 'phieagles', conference: 'NFC', division: 'East' },
    { name: 'New York Giants', value: 'nygiants', conference: 'NFC', division: 'East' },
    { name: 'Washington Commanders', value: 'washingtoncommanders', conference: 'NFC', division: 'East' },

    // NFC North
    { name: 'Green Bay Packers', value: 'greenbaypackers', conference: 'NFC', division: 'North' },
    { name: 'Minnesota Vikings', value: 'minnesotavikings', conference: 'NFC', division: 'North' },
    { name: 'Chicago Bears', value: 'chicagobears', conference: 'NFC', division: 'North' },
    { name: 'Detroit Lions', value: 'detroitlions', conference: 'NFC', division: 'North' },

    // NFC South
    { name: 'New Orleans Saints', value: 'neworleanssaints', conference: 'NFC', division: 'South' },
    { name: 'Tampa Bay Buccaneers', value: 'tampabaybuccaneers', conference: 'NFC', division: 'South' },
    { name: 'Atlanta Falcons', value: 'atlantafalcons', conference: 'NFC', division: 'South' },
    { name: 'Carolina Panthers', value: 'carolinapanthers', conference: 'NFC', division: 'South' },

    // NFC West
    { name: 'Seattle Seahawks', value: 'seaseahawks', conference: 'NFC', division: 'West' },
    { name: 'San Francisco 49ers', value: 'sf49ers', conference: 'NFC', division: 'West' },
    { name: 'Los Angeles Rams', value: 'larams', conference: 'NFC', division: 'West' },
    { name: 'Arizona Cardinals', value: 'arizonacardinals', conference: 'NFC', division: 'West' },
];

const OTHER_THEMES = [
    { name: 'Default', value: 'mytheme' },
    { name: 'Dark', value: 'dracula' },
];

const NFLThemeDropdown = () => {
    const { theme, setTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConference, setSelectedConference] = useState<'ALL' | 'AFC' | 'NFC'>('ALL');
    const [selectedDivision, setSelectedDivision] = useState<'ALL' | 'East' | 'North' | 'South' | 'West'>('ALL');
    const [isOpen, setIsOpen] = useState(false);

    const filteredTeams = useMemo(() => {
        return NFL_TEAMS.filter(team => {
            const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesConference = selectedConference === 'ALL' || team.conference === selectedConference;
            const matchesDivision = selectedDivision === 'ALL' || team.division === selectedDivision;
            return matchesSearch && matchesConference && matchesDivision;
        });
    }, [searchTerm, selectedConference, selectedDivision]);

    const groupedTeams = useMemo(() => {
        const grouped: Record<string, Record<string, TeamTheme[]>> = {};
        
        filteredTeams.forEach(team => {
            if (!grouped[team.conference]) {
                grouped[team.conference] = {};
            }
            if (!grouped[team.conference][team.division]) {
                grouped[team.conference][team.division] = [];
            }
            grouped[team.conference][team.division].push(team);
        });
        
        return grouped;
    }, [filteredTeams]);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        setIsOpen(false);
    };

    const getCurrentThemeName = () => {
        const team = NFL_TEAMS.find(t => t.value === theme);
        if (team) return team.name;
        const other = OTHER_THEMES.find(t => t.value === theme);
        return other?.name || 'Custom';
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedConference('ALL');
        setSelectedDivision('ALL');
    };

    return (
        <div className="dropdown dropdown-end absolute bottom-0 right-0">
            <div 
                tabIndex={0} 
                role="button" 
                className="btn m-1 bg-secondary text-primary"
                onClick={() => setIsOpen(!isOpen)}
            >
                {getCurrentThemeName()}
                <svg
                    width="12px"
                    height="12px"
                    className="inline-block h-2 w-2 fill-current opacity-60"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048">
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
            </div>
            
            {isOpen && (
                <div className="dropdown-content bg-base-100 rounded-box z-[1] w-80 max-h-96 overflow-hidden border border-base-300 shadow-2xl text-base-content">
                    {/* Search and Filters */}
                    <div className="p-3 border-b border-base-300">
                        <input
                            type="text"
                            placeholder="Search teams..."
                            className="input input-sm input-bordered w-full mb-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        <div className="flex gap-2 mb-2">
                            <select 
                                className="select select-sm select-bordered flex-1"
                                value={selectedConference}
                                onChange={(e) => setSelectedConference(e.target.value as any)}
                            >
                                <option value="ALL">All Conferences</option>
                                <option value="AFC">AFC</option>
                                <option value="NFC">NFC</option>
                            </select>
                            
                            <select 
                                className="select select-sm select-bordered flex-1"
                                value={selectedDivision}
                                onChange={(e) => setSelectedDivision(e.target.value as any)}
                            >
                                <option value="ALL">All Divisions</option>
                                <option value="East">East</option>
                                <option value="North">North</option>
                                <option value="South">South</option>
                                <option value="West">West</option>
                            </select>
                        </div>
                        
                        <button 
                            className="btn btn-xs btn-ghost w-full"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto max-h-64 p-2">
                        {/* Other Themes */}
                        <div className="mb-3">
                            <div className="text-xs font-semibold text-base-content/60 mb-1 px-2">GENERAL</div>
                            {OTHER_THEMES.map((themeOption) => (
                                <button
                                    key={themeOption.value}
                                    className={`btn btn-sm btn-ghost w-full justify-start mb-1 ${
                                        theme === themeOption.value ? 'btn-primary' : ''
                                    }`}
                                    onClick={() => handleThemeChange(themeOption.value)}
                                >
                                    <span className={`w-3 h-3 rounded-full mr-2 ${
                                        theme === themeOption.value ? 'bg-primary-content' : 'bg-base-300'
                                    }`}></span>
                                    {themeOption.name}
                                </button>
                            ))}
                        </div>

                        {/* NFL Teams by Conference and Division */}
                        {Object.entries(groupedTeams).sort().map(([conference, divisions]) => (
                            <div key={conference} className="mb-3">
                                <div className="text-xs font-semibold text-base-content/60 mb-1 px-2">{conference}</div>
                                {Object.entries(divisions).sort().map(([division, teams]) => (
                                    <div key={`${conference}-${division}`} className="mb-2">
                                        <div className="text-xs text-base-content/40 mb-1 px-4">{division}</div>
                                        {teams.sort((a, b) => a.name.localeCompare(b.name)).map((team) => (
                                            <button
                                                key={team.value}
                                                className={`btn btn-sm btn-ghost w-full justify-start mb-1 text-left ${
                                                    theme === team.value ? 'btn-primary' : ''
                                                }`}
                                                onClick={() => handleThemeChange(team.value)}
                                            >
                                                <span className={`w-3 h-3 rounded-full mr-2 ${
                                                    theme === team.value ? 'bg-primary-content' : 'bg-base-300'
                                                }`}></span>
                                                <span className="truncate">{team.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                        
                        {filteredTeams.length === 0 && (
                            <div className="text-center text-base-content/60 py-4">
                                No teams found matching your criteria
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NFLThemeDropdown;