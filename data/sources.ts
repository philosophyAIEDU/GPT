export type AdmissionsCategory =
  | "전형 개요"
  | "학생부"
  | "수능/모의고사"
  | "면접"
  | "자기소개서"
  | "대학별 전형"
  | "일정/타임라인"
  | "용어사전";

export type SourceItem = {
  title: string;
  organization: string;
  description: string;
  url: string;
};

export const categoryList: AdmissionsCategory[] = [
  "전형 개요",
  "학생부",
  "수능/모의고사",
  "면접",
  "자기소개서",
  "대학별 전형",
  "일정/타임라인",
  "용어사전",
];

export const admissionsSources: Record<AdmissionsCategory, SourceItem[]> = {
  "전형 개요": [
    {
      title: "대입정보포털 어디가",
      organization: "한국대학교육협의회",
      description: "대입 전형 구조와 대학별 입시 정보를 확인할 수 있는 공식 포털",
      url: "https://www.adiga.kr",
    },
    {
      title: "대입전형시행계획",
      organization: "한국대학교육협의회",
      description: "연도별 대입전형 기본 계획과 변화를 확인",
      url: "https://www.kcue.or.kr",
    },
    {
      title: "고교학점제·진로진학 자료",
      organization: "교육부",
      description: "고교 교육과정과 진학 준비 연계 정보",
      url: "https://www.moe.go.kr",
    },
  ],
  "학생부": [
    {
      title: "학교생활기록부 기재요령",
      organization: "교육부",
      description: "학생부 항목별 공식 기재 기준",
      url: "https://www.moe.go.kr",
    },
    {
      title: "학생부종합전형 안내",
      organization: "한국대학교육협의회",
      description: "학생부종합전형 평가 요소와 준비 가이드",
      url: "https://www.kcue.or.kr",
    },
    {
      title: "시도교육청 진로진학센터",
      organization: "시도교육청",
      description: "지역별 학생부 관리 및 상담 자료",
      url: "https://www.gen.go.kr",
    },
  ],
  "수능/모의고사": [
    {
      title: "한국교육과정평가원 수능/모의평가",
      organization: "한국교육과정평가원",
      description: "수능 시행 기본계획, 기출문항, 정답 공개",
      url: "https://www.kice.re.kr",
    },
    {
      title: "EBSi 수능 학습자료",
      organization: "EBS",
      description: "수능 연계 강의와 학습 자료 제공",
      url: "https://www.ebsi.co.kr",
    },
    {
      title: "수능 원서접수/시험 안내",
      organization: "시도교육청",
      description: "원서접수 일정 및 시험장 공지",
      url: "https://www.sen.go.kr",
    },
  ],
  면접: [
    {
      title: "대학별 면접 가이드",
      organization: "대입정보포털 어디가",
      description: "대학별 면접 유형 및 평가 요소",
      url: "https://www.adiga.kr",
    },
    {
      title: "선행학습영향평가보고서",
      organization: "각 대학 입학처",
      description: "면접·논술 문항의 출제 취지와 기출 확인",
      url: "https://www.ac.kr",
    },
    {
      title: "진로진학 상담자료",
      organization: "시도교육청",
      description: "면접 준비 체크리스트와 사례 자료",
      url: "https://www.pen.go.kr",
    },
  ],
  자기소개서: [
    {
      title: "자기소개서 폐지/활용 여부 공지",
      organization: "교육부/대교협",
      description: "연도별 자기소개서 반영 정책 확인",
      url: "https://www.kcue.or.kr",
    },
    {
      title: "대학별 제출서류 안내",
      organization: "대학 입학처",
      description: "대학별 자소서/추가서류 제출 조건 확인",
      url: "https://www.jinhak.or.kr",
    },
    {
      title: "공정성 가이드라인",
      organization: "교육부",
      description: "입시서류 작성 시 유의사항 및 금지사항",
      url: "https://www.moe.go.kr",
    },
  ],
  "대학별 전형": [
    {
      title: "대학 입학처 모아보기",
      organization: "대입정보포털 어디가",
      description: "대학별 모집요강, 전형방법, 경쟁률 링크 제공",
      url: "https://www.adiga.kr",
    },
    {
      title: "대학알리미",
      organization: "한국대학교육협의회",
      description: "대학 공시 정보 및 학과·취업 통계",
      url: "https://www.academyinfo.go.kr",
    },
    {
      title: "각 대학 입학처",
      organization: "개별 대학",
      description: "최신 모집요강과 공지사항의 1차 출처",
      url: "https://ipsi.uwayapply.com",
    },
  ],
  "일정/타임라인": [
    {
      title: "대입 전형 일정",
      organization: "한국대학교육협의회",
      description: "수시/정시 주요 일정 및 원서접수 기간",
      url: "https://www.kcue.or.kr",
    },
    {
      title: "수능 시행 일정",
      organization: "한국교육과정평가원",
      description: "원서접수, 시험일, 성적발표 일정",
      url: "https://www.kice.re.kr",
    },
    {
      title: "학교 학사일정",
      organization: "재학 고교/교육청",
      description: "학교별 비교과/내신 일정 체크",
      url: "https://www.schoolinfo.go.kr",
    },
  ],
  용어사전: [
    {
      title: "대입 용어사전",
      organization: "대입정보포털 어디가",
      description: "입시 필수 용어와 전형 개념 설명",
      url: "https://www.adiga.kr",
    },
    {
      title: "고교학점제 용어",
      organization: "교육부",
      description: "교육과정 개편 및 과목 선택 관련 용어",
      url: "https://www.moe.go.kr",
    },
    {
      title: "수능/평가 용어",
      organization: "한국교육과정평가원",
      description: "표준점수, 백분위 등 성적 지표 설명",
      url: "https://www.kice.re.kr",
    },
  ],
};
