import React, { useEffect, useState } from "react";
import Challenge from "./Challenge";
import { retrieveCategory, retrieveUser } from "code-this-client-logic";

function Challenges({
  match: {
    params: { category: categoryName },
  },
}) {
  const [category, setCategory] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    handleRetrieveCategory();
    setSelectedChallenge(0)
  }, [categoryName]);

  useEffect(() => {
    handleRetrieveUser();
  }, []);

  const handleRetrieveUser = async () => {
    const _user = await retrieveUser(localStorage.token);
    setUser(_user);
  };

  const handleRetrieveCategory = async () => {
    const _category = await retrieveCategory(categoryName);
    setCategory(_category);
  };

  const next = () => setSelectedChallenge(selectedChallenge + 1);

  const previous = () => setSelectedChallenge(selectedChallenge - 1);

  const getCurrentChallenge = () => {
    if (!category) return null;
    return category.challenges[selectedChallenge];
  };

  const currentChallenge = getCurrentChallenge();

  const buttons = (
    <>
      {category && (
        <>
          <button onClick={previous} disabled={selectedChallenge <= 0}>
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          <button
            onClick={next}
            disabled={selectedChallenge >= category.challenges.length - 1}
          >
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </button>
        </>
      )}
    </>
  );

  return (
    <>
      {category && user ? (
        <>
          {currentChallenge && (
            <Challenge
              buttons={buttons}
              categoryName={category.name}
              {...currentChallenge}
              user={user}
              handleRetrieveCategory={handleRetrieveCategory}
            />
          )}
        </>
      ) : (
        <p>loading challenges..</p>
      )}
    </>
  );
}

export default Challenges;
