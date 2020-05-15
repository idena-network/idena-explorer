import Layout from '../shared/components/layout';

export default function Error404() {
  return (
    <Layout>
      <section className="section section_message" style={{ height: '80vh' }}>
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-8">
              <h1 className="section_message__accent">404</h1>
              <div className="section_message__text">
                The page you were looking for doesn’t exist.
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
