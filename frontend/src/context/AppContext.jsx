import React, { createContext, useContext, useState, useEffect } from "react";
import { getWatchlistApi, toggleWatchlistApi, toggleUpvoteApi } from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { citizen, isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [upvotedIds, setUpvotedIds] = useState(new Set());
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  // Sync upvoted issues and watchlist when citizen changes
  useEffect(() => {
    if (isAuthenticated && citizen) {
      if (citizen.upvotedIssues) {
        setUpvotedIds(new Set(citizen.upvotedIssues.map((id) => id.toString())));
      }
      fetchWatchlist();
    } else {
      setWatchlist([]);
      setUpvotedIds(new Set());
    }
  }, [isAuthenticated, citizen]);

  const fetchWatchlist = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingWatchlist(true);
      const res = await getWatchlistApi();
      if (res.data.success) {
        setWatchlist(res.data.watchlist || []);
      }
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  const isWatchlisted = (issueId) => {
    if (!issueId) return false;
    return watchlist.some((item) => (item._id || item) === issueId);
  };

  const toggleWatchlist = async (issue) => {
    if (!isAuthenticated) {
      throw new Error("AUTH_REQUIRED");
    }
    const issueId = issue._id || issue;
    try {
      const res = await toggleWatchlistApi(issueId);
      if (res.data.success) {
        if (res.data.saved) {
          // Add to watchlist state
          setWatchlist((prev) => [...prev, issue]);
        } else {
          // Remove from watchlist state
          setWatchlist((prev) => prev.filter((item) => (item._id || item) !== issueId));
        }
        return res.data;
      }
    } catch (error) {
      console.error("Failed to toggle watchlist:", error);
      throw error;
    }
  };

  const isUpvoted = (issueId) => {
    if (!issueId) return false;
    return upvotedIds.has(issueId.toString());
  };

  const toggleUpvote = async (issueId) => {
    if (!isAuthenticated) {
      throw new Error("AUTH_REQUIRED");
    }
    try {
      const res = await toggleUpvoteApi(issueId);
      if (res.data.success) {
        setUpvotedIds((prev) => {
          const newSet = new Set(prev);
          if (res.data.upvoted) {
            newSet.add(issueId.toString());
          } else {
            newSet.delete(issueId.toString());
          }
          return newSet;
        });
        return res.data;
      }
    } catch (error) {
      console.error("Failed to toggle upvote:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        watchlist,
        watchlistCount: watchlist.length,
        loadingWatchlist,
        fetchWatchlist,
        isWatchlisted,
        toggleWatchlist,
        isUpvoted,
        toggleUpvote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
