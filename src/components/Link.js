import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { AUTH_TOKEN } from '../constants';

export const VOTE_MUTATION = gql`
  mutation VoteMutation($imgId: Int!) {
    createVote(imgId: $imgId) {
      img {
        id
        imgSrc
        roverName
        cameraName
        earthDate
        postedBy {
          id
          username
        }
        votes {
          id
        }
      }
    }
  }
`;

const Link = ({ link, index }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  console.log('link:', link);

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      imgId: parseInt(link.id, 10),  // Asegúrate de usar imgId aquí
    }
  });

  const voteCount = (link.votes || []).length;
  const posterName = link.postedBy ? link.postedBy.username : 'Unknown';

  return (
    <div className="link-container">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <div className="vote-button" onClick={() => vote()}>
            ▲
          </div>
        )}
      </div>
      <div className="link-content">
        <div className="link-info">
          <img src={link.imgSrc} alt="Rover" className="link-image" />
          <div>
            {link.roverName} ({link.cameraName}) ({link.earthDate})
          </div>
        </div>
        <div className="f6 lh-copy gray">
          {voteCount} votes | by {posterName}
        </div>
      </div>
    </div>
  );
};

export default Link;