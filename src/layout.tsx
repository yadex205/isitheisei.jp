import React from 'react';
import Helmet from 'react-helmet';

interface Props {
  children: React.ReactNode;
}

export default class Layout extends React.Component<Props> {
  render() {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <link href="/humans.txt" rel="author" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:creator" content="@yadex205_vj" />
          <meta property="og:title" content="Is it Heisei?" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://isitheisei.jp" />
          <link href="https://isitheisei.jp" rel="canonical" />
          <title>Is it Heisei?</title>
        </Helmet>
        {this.props.children}
      </>
    );
  }
}
