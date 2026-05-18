'use client';

import DiagnoseModule from './DiagnoseModule';
import TrafoItModule from './TrafoItModule';
import TrafoTnModule from './TrafoTnModule';
import LikeretterPivModule from './LikeretterPivModule';
import InstallasjonsanalyseModule from './InstallasjonsanalyseModule';

type Props = {
  id: string;
};

export function ModuleRouter({ id }: Props) {
  switch (id) {
    case 'diagnose':
      return <DiagnoseModule />;
    case 'trafo-it':
      return <TrafoItModule />;
    case 'trafo-tn':
      return <TrafoTnModule />;
    case 'likeretter-piv':
      return <LikeretterPivModule />;
    case 'installasjonsanalyse':
      return <InstallasjonsanalyseModule />;
    default:
      return (
        <section className="glass rounded-2xl p-6 text-copper-300">
          Fant ikke modulen «{id}».
        </section>
      );
  }
}
