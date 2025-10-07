import { useState, useEffect, useCallback } from 'react';

export interface GameState {
  farmState: any;
  communityPosts: any[];
  leaderboard: any[];
  userStats: {
    totalScore: number;
    sustainability: number;
    yield: number;
    gamesPlayed: number;
  };
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    farmState: null,
    communityPosts: [],
    leaderboard: [],
    userStats: {
      totalScore: 0,
      sustainability: 0,
      yield: 0,
      gamesPlayed: 0
    }
  });

  // Load game state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('farmtech_game_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGameState(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    }
  }, []);

  // Save game state to localStorage
  const saveGameState = useCallback((newState: Partial<GameState>) => {
    setGameState(prev => {
      const updated = { ...prev, ...newState };
      localStorage.setItem('farmtech_game_state', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Update farm state
  const updateFarmState = useCallback((farmState: any) => {
    saveGameState({ farmState });
  }, [saveGameState]);

  // Add community post
  const addCommunityPost = useCallback((post: any) => {
    setGameState(prev => {
      const updated = {
        ...prev,
        communityPosts: [post, ...prev.communityPosts]
      };
      localStorage.setItem('farmtech_game_state', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Update user stats
  const updateUserStats = useCallback((stats: Partial<GameState['userStats']>) => {
    setGameState(prev => {
      const updated = {
        ...prev,
        userStats: { ...prev.userStats, ...stats }
      };
      localStorage.setItem('farmtech_game_state', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Share farm progress to community
  const shareFarmProgress = useCallback((farmState: any, userStats: any) => {
    const post = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        location: 'Your Farm',
        verified: true
      },
      content: `Just achieved ${farmState.sustainability}% sustainability score! My crops are growing well with ${farmState.yield} total yield. The AI recommendations are really helping! 🌱`,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      tags: ['sustainability', 'ai-recommendations', 'crop-yield'],
      category: 'Success Stories'
    };
    
    addCommunityPost(post);
  }, [addCommunityPost]);

  return {
    gameState,
    updateFarmState,
    addCommunityPost,
    updateUserStats,
    shareFarmProgress,
    saveGameState
  };
};
