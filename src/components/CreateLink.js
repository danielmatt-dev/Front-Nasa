import React, { useState } from "react";
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import { FEED_QUERY } from './LinkList';

const CreateLink = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    imgSrc: '',
    roverName: '',
    cameraName: '',
    earthDate: ''
  });

  const [createLink, { data, loading, error }] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      imgSrc: formState.imgSrc,
      roverName: formState.roverName,
      cameraName: formState.cameraName,
      earthDate: formState.earthDate
    },
    update: (cache, { data: { createImage } }) => {
      const data = cache.readQuery({
        query: FEED_QUERY,
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: [createImage, ...data.feed.links]
          }
        },
      });
    },
    onCompleted: () => navigate('/')
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createLink().catch(err => {
            console.error('Error en el formulario:', err);
          });
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.imgSrc}
            onChange={(e) =>
              setFormState({
                ...formState,
                imgSrc: e.target.value
              })
            }
            type="text"
            placeholder="The URL for the imgSrc"
          />
          <input
            className="mb2"
            value={formState.roverName}
            onChange={(e) =>
              setFormState({
                ...formState,
                roverName: e.target.value
              })
            }
            type="text"
            placeholder="A description for the roverName"
          />
          <input
            className="mb2"
            value={formState.cameraName}
            onChange={(e) =>
              setFormState({
                ...formState,
                cameraName: e.target.value
              })
            }
            type="text"
            placeholder="A description for the cameraName"
          />
          <input
            className="mb2"
            value={formState.earthDate}
            onChange={(e) =>
              setFormState({
                ...formState,
                earthDate: e.target.value
              })
            }
            type="date"
            placeholder="A description for the earthDate"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};
    
const CREATE_LINK_MUTATION = gql`
  mutation CreateImage(
    $imgSrc: String!,
    $roverName: String!,
    $cameraName: String!,
    $earthDate: String!
  ) {
    createImage(
      imgSrc: $imgSrc,
      roverName: $roverName,
      cameraName: $cameraName,
      earthDate: $earthDate
    ) {
      id
      imgSrc
      roverName
      cameraName
      earthDate
    }
  }
`;


export default CreateLink;