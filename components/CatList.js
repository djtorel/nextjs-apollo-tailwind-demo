import { useQuery } from '@apollo/react-hooks';
// import { NetworkStatus } from 'apollo-boost';
import gql from 'graphql-tag';
import ErrorMessage from './ErrorMessage';

export const ALL_CATS_QUERY = gql`
  query {
    cats {
      id
      name
    }
  }
`;

const CatList = () => {
  const { loading, error, data } = useQuery(ALL_CATS_QUERY, {
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true,
  });

  if (error) return <ErrorMessage message="Error loading cats." />;
  if (loading) return <div>Loading...</div>;
  const { cats } = data;

  return (
    <section>
      <ul>
        {cats.map(({ id, name }) => (
          <li key={id}>
            <div>
              <span>Name: </span>
              <span>{name}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CatList;
