import { useState } from 'react';
import { companyProfile, agencyStats, profileManager, profileDocuments, profilePayments, profileCoverage, profileFleet, profileTeam, profileTimeline, profileCharts, quickActions } from '@data/profileData';
import AgencyProfileHeader from '@components/agency/AgencyProfileHeader';
import AgencyProfileStats from '@components/agency/AgencyProfileStats';
import AgencyProfileInfo from '@components/agency/AgencyProfileInfo';
import AgencyProfileManager from '@components/agency/AgencyProfileManager';
import AgencyProfileDocuments from '@components/agency/AgencyProfileDocuments';
import AgencyProfilePayments from '@components/agency/AgencyProfilePayments';
import AgencyProfileCoverage from '@components/agency/AgencyProfileCoverage';
import AgencyProfileFleet from '@components/agency/AgencyProfileFleet';
import AgencyProfileTeam from '@components/agency/AgencyProfileTeam';
import AgencyProfileTimeline from '@components/agency/AgencyProfileTimeline';
import AgencyProfileCharts from '@components/agency/AgencyProfileCharts';
import AgencyQuickActions from '@components/agency/AgencyQuickActions';
import AgencyProfileSkeleton from '@components/agency/AgencyProfileSkeleton';

export default function AgencyProfile() {
  const [loading, setLoading] = useState(false);

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleDownload = (docId) => {
    console.log('Download document', docId);
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick action', actionId);
  };

  if (loading) {
    return <AgencyProfileSkeleton />;
  }

  return (
    <div className="apro-page">
      <AgencyProfileHeader profile={companyProfile} onEdit={handleEditProfile} />
      <AgencyProfileStats stats={agencyStats} />
      <AgencyQuickActions actions={quickActions} onAction={handleQuickAction} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AgencyProfileInfo profile={companyProfile} />
          <AgencyProfileManager manager={profileManager} />
          <AgencyProfileDocuments documents={profileDocuments} onDownload={handleDownload} />
          <AgencyProfileCharts charts={profileCharts} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AgencyProfilePayments payments={profilePayments} />
          <AgencyProfileCoverage coverage={profileCoverage} />
          <AgencyProfileFleet fleet={profileFleet} />
          <AgencyProfileTeam team={profileTeam} />
          <AgencyProfileTimeline events={profileTimeline} />
        </div>
      </div>
    </div>
  );
}
