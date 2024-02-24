'use client';

import { useState, useEffect } from 'react';

import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data?.map(post => (
        <PromptCard 
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResult, setSearchedResult] = useState([]);

  const filteredPrompts = (searchText) => {
    const regex = new RegExp(searchText, 'i');

    return posts.filter(prompt => 
        regex.test(prompt.tag) ||
        regex.test(prompt.prompt)
      )
  }

  const handleSearchChange = (e) => {
    e.preventDefault();
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filteredPrompts(e.target.value);
        setSearchedResult(searchResult);
      }, 800)
    );
  };

  const handleTagClick = (tag) => {
    clearTimeout(searchTimeout);
    setSearchText(tag);
    const searchResult = filteredPrompts(tag);
    setSearchedResult(searchResult);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input 
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      <PromptCardList 
        data={searchText ? searchedResult : posts}
        handleTagClick={handleTagClick}
      />
    </section>
  )
}

export default Feed;