import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import React from 'react';

function TermsAndConditions() {
  return (
    <>
      <AppBarBackUniversal />
      <div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 sm:px-0">
        <h1 className="font-semibold text-center text-2xl">
          Terms and conditions
        </h1>
        <div>
          <p className="font-semibold pb-2">Introduction</p>
          These terms and conditions govern the use of the RealGaged marketplace
          (the "Marketplace") operated by MYDAILYPREP LTD, trading as RealGaged
          ("we," "our," or "us"). By using the Marketplace, you accept these
          terms and conditions in full. If you disagree with these terms and
          conditions or any part of these terms and conditions, you must not use
          the Marketplace.
        </div>
        <div>
          <p className="font-semibold pb-2"> Services Provided by RealGaged </p>
          RealGaged provides a platform that allows content creators to offer
          and sell their services to users of the Marketplace ("Customers"). We
          are not responsible for the services offered by content creators, nor
          do we endorse or guarantee the quality or suitability of those
          services. Content creators are solely responsible for their services
          and the delivery of those services.
        </div>
        <div>
          <p className="font-semibold pb-2"> Content Creators </p>
          Content creators who wish to offer their services through the
          Marketplace must register with RealGaged and agree to these terms and
          conditions. Content creators must provide accurate and complete
          information about themselves and their services. We reserve the right
          to refuse registration or to terminate the registration of any content
          creator at any time for any reason.
        </div>
        <div>
          <p className="font-semibold pb-2"> Services </p>
          Customers can purchase services offered by content creators through
          the Marketplace. The terms and conditions of each service are set by
          the content creator and must be agreed to by the Customer before
          purchase. RealGaged is not a party to any transaction between a
          Customer and a content creator and is not responsible for any aspect
          of the service, including but not limited to the quality, legality, or
          delivery of the service.
        </div>
        <div>
          <p className="font-semibold pb-2"> Payments </p>
          Payments for services purchased through the Marketplace are processed
          by RealGaged on behalf of the content creator. RealGaged charges a
          commission on the sale of each service, which is deducted from the
          payment made by the Customer. Content creators are paid the balance of
          the sale price after commission deductions. RealGaged is not
          responsible for any payment disputes between a Customer and a content
          creator.
        </div>
        <div>
          <p className="font-semibold pb-2"> Intellectual Property </p>
          Content creators are solely responsible for the content they provide
          through the Marketplace, including but not limited to any intellectual
          property contained in that content. Content creators represent and
          warrant that they have the right to offer their services and that
          their services do not infringe the intellectual property rights of any
          third party. RealGaged is not responsible for any infringement or
          violation of intellectual property rights by a content creator.
        </div>
        <div>
          <p className="font-semibold pb-2"> Indemnification </p>
          Content creators agree to indemnify and hold RealGaged and MYDAILYPREP
          LTD harmless from any claim or demand, including reasonable attorneys'
          fees, made by any third party due to or arising out of their services,
          their content, their use of the Marketplace, their violation of these
          terms and conditions, or their violation of any law or the rights of
          any third party.
        </div>
        <div>
          <p className="font-semibold pb-2"> Limitation of Liability </p>
          RealGaged and MYDAILYPREP LTD are not liable to any Customer or
          content creator for any indirect, special, or consequential damages,
          including but not limited to lost profits, lost revenue, or lost
          business opportunities. Our total liability to any Customer or content
          creator is limited to the commission charged on the sale of the
          service that gave rise to the liability.
        </div>
        <div>
          <p className="font-semibold pb-2"> Termination </p>
          We reserve the right to terminate or suspend any Customer's or content
          creator's access to the Marketplace at any time and for any reason
          without notice.
        </div>
        <div>
          <p className="font-semibold pb-2"> Governing Law </p>
          These terms and conditions are governed by and construed in accordance
          with the laws of the jurisdiction in which MYDAILYPREP LTD is located.
        </div>
        <div>
          <p className="font-semibold pb-2">
            {' '}
            Changes to Terms and Conditions{' '}
          </p>
          We reserve the right to modify these terms and conditions at any time.
          The updated terms and conditions will be posted on
        </div>
      </div>
    </>
  );
}

export default TermsAndConditions;
