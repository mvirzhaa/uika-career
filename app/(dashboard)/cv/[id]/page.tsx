'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  EyeOff,
  ImageIcon,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cvsApi } from '@/lib/api/cvs';
import { Button } from '@/components/ui/Button';
import type { CV, CVSection, CVSectionType, CVTemplateType, User } from '@/types';

type CVItem = {
  id: string;
  title?: string;
  subtitle?: string;
  meta?: string;
  description?: string;
};

type CVSectionContent = {
  _kind?: string;
  fullName?: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: string;
  photoUrl?: string;
  body?: string;
  skills?: string;
  items?: CVItem[];
};

type EditorSection = Omit<CVSection, 'content'> & {
  content: CVSectionContent;
};

const TEMPLATE_OPTIONS: Array<{ id: CVTemplateType; name: string; detail: string }> = [
  { id: 'MODERN', name: 'Modern', detail: 'Header kuat, aksen hijau UIKA' },
  { id: 'CLASSIC', name: 'Klasik', detail: 'Formal, bersih, ATS friendly' },
  { id: 'CREATIVE', name: 'Kreatif', detail: 'Sidebar profil dan aksen hangat' },
];

const SECTION_LIBRARY: Array<{ type: CVSectionType; title: string; button: string }> = [
  { type: 'summary', title: 'Tentang Saya', button: 'Ringkasan' },
  { type: 'experience', title: 'Pengalaman Kerja', button: 'Pengalaman' },
  { type: 'education', title: 'Pendidikan', button: 'Pendidikan' },
  { type: 'skill', title: 'Keahlian', button: 'Keahlian' },
  { type: 'project', title: 'Proyek', button: 'Proyek' },
  { type: 'certification', title: 'Sertifikasi', button: 'Sertifikasi' },
  { type: 'organization', title: 'Organisasi', button: 'Organisasi' },
  { type: 'award', title: 'Penghargaan', button: 'Penghargaan' },
  { type: 'language', title: 'Bahasa', button: 'Bahasa' },
  { type: 'custom', title: 'Section Kustom', button: 'Kustom' },
];

const itemSectionTypes = new Set<CVSectionType>([
  'experience',
  'education',
  'project',
  'certification',
  'organization',
  'award',
  'language',
  'reference',
  'custom',
]);

const makeLocalId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const sectionOrder = (section: CVSection) => section.orderIndex ?? section.order ?? 0;

const normalizeTemplate = (value?: string | null): CVTemplateType => {
  if (value === 'CLASSIC' || value === 'CREATIVE' || value === 'MODERN') return value;
  return 'MODERN';
};

const getContent = (section: CVSection): CVSectionContent => {
  if (section.content && typeof section.content === 'object') {
    return section.content as CVSectionContent;
  }
  return {};
};

const isPersonalSection = (section: EditorSection) => section.content._kind === 'personal_info';

const defaultPersonalContent = (user: User | null): CVSectionContent => {
  const profile = user?.profile;
  const location = [profile?.city, profile?.province].filter(Boolean).join(', ') || profile?.address || '';

  return {
    _kind: 'personal_info',
    fullName: user?.name || profile?.fullName || '',
    headline: profile?.headline || 'Mahasiswa / Alumni UIKA',
    email: user?.email || '',
    phone: profile?.phone || '',
    location,
    links: [profile?.linkedinUrl, profile?.githubUrl, profile?.portfolioUrl].filter(Boolean).join(' | '),
    photoUrl: profile?.avatarUrl || user?.avatarUrl || '',
  };
};

const makePersonalSection = (user: User | null): EditorSection => ({
  id: makeLocalId(),
  cvId: '',
  type: 'custom',
  title: 'Informasi Pribadi',
  orderIndex: 0,
  isVisible: true,
  content: defaultPersonalContent(user),
});

const defaultSectionContent = (type: CVSectionType): CVSectionContent => {
  if (type === 'summary') {
    return { body: 'Tuliskan ringkasan singkat tentang latar belakang, keahlian utama, dan tujuan karir Anda.' };
  }

  if (type === 'skill') {
    return { skills: 'Komunikasi, Microsoft Office, Analisis Data, Kerja Tim' };
  }

  return {
    items: [
      {
        id: makeLocalId(),
        title: type === 'education' ? 'Universitas Ibn Khaldun Bogor' : 'Judul / Posisi',
        subtitle: type === 'education' ? 'Program Studi / Fakultas' : 'Instansi / Perusahaan',
        meta: '2022 - Sekarang',
        description: 'Tuliskan detail, tanggung jawab, pencapaian, atau konteks penting di sini.',
      },
    ],
  };
};

const makeSection = (type: CVSectionType, title: string, orderIndex: number): EditorSection => ({
  id: makeLocalId(),
  cvId: '',
  type,
  title,
  orderIndex,
  isVisible: true,
  content: defaultSectionContent(type),
});

const normalizeSections = (rawSections: CVSection[] | undefined, user: User | null): EditorSection[] => {
  const normalized = (rawSections || [])
    .map((section) => ({
      ...section,
      orderIndex: sectionOrder(section),
      isVisible: section.isVisible ?? true,
      content: getContent(section),
    }))
    .sort((a, b) => sectionOrder(a) - sectionOrder(b));

  const hasPersonal = normalized.some((section) => section.content._kind === 'personal_info');
  const withPersonal = hasPersonal ? normalized : [makePersonalSection(user), ...normalized];

  if (normalized.length > 0) {
    return withPersonal.map((section, index) => ({ ...section, orderIndex: index }));
  }

  return [
    withPersonal[0],
    makeSection('summary', 'Tentang Saya', 1),
    makeSection('experience', 'Pengalaman Kerja', 2),
    makeSection('education', 'Pendidikan', 3),
    makeSection('skill', 'Keahlian', 4),
  ];
};

const splitLines = (value?: string) =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const getInitials = (name?: string) => {
  const parts = (name || 'UIKA').split(' ').filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
};

export default function CVEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [cv, setCv] = useState<CV | null>(null);
  const [title, setTitle] = useState('');
  const [templateType, setTemplateType] = useState<CVTemplateType>('MODERN');
  const [sections, setSections] = useState<EditorSection[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [deletedSectionIds, setDeletedSectionIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        setIsLoading(true);
        const data = await cvsApi.getById(id as string);
        const normalized = normalizeSections(data.sections, user);
        setCv(data);
        setTitle(data.title);
        setTemplateType(normalizeTemplate(data.templateType));
        setSections(normalized);
        setActiveSectionId(normalized.find((section) => !isPersonalSection(section))?.id || normalized[0]?.id || null);
      } catch (err) {
        console.error(err);
        alert('CV tidak ditemukan');
        router.push('/cv');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCV();
  }, [id, router, user]);

  const personalSection = useMemo(
    () => sections.find((section) => isPersonalSection(section)) || makePersonalSection(user),
    [sections, user],
  );

  const editableSections = sections.filter((section) => !isPersonalSection(section));
  const activeSection = sections.find((section) => section.id === activeSectionId) || editableSections[0] || null;

  const updateSection = (sectionId: string, patch: Partial<EditorSection>) => {
    setSections((current) =>
      current.map((section) => (section.id === sectionId ? { ...section, ...patch } : section)),
    );
    setSaveMessage(null);
  };

  const updateSectionContent = (sectionId: string, patch: Partial<CVSectionContent>) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId ? { ...section, content: { ...section.content, ...patch } } : section,
      ),
    );
    setSaveMessage(null);
  };

  const addSection = (type: CVSectionType, sectionTitle: string) => {
    const next = makeSection(type, sectionTitle, sections.length);
    setSections((current) => [...current, next]);
    setActiveSectionId(next.id);
    setSaveMessage(null);
  };

  const removeSection = (sectionId: string) => {
    const section = sections.find((item) => item.id === sectionId);
    if (!section || isPersonalSection(section)) return;

    if (!section.id.startsWith('local-')) {
      setDeletedSectionIds((current) => [...current, section.id]);
    }

    const remaining = sections.filter((item) => item.id !== sectionId).map((item, index) => ({ ...item, orderIndex: index }));
    setSections(remaining);
    setActiveSectionId(remaining.find((item) => !isPersonalSection(item))?.id || null);
    setSaveMessage(null);
  };

  const moveSection = (sectionId: string, direction: -1 | 1) => {
    const current = [...sections];
    const index = current.findIndex((section) => section.id === sectionId);
    const targetIndex = index + direction;
    if (index <= 0 || targetIndex <= 0 || targetIndex >= current.length) return;

    const [section] = current.splice(index, 1);
    current.splice(targetIndex, 0, section);
    setSections(current.map((item, orderIndex) => ({ ...item, orderIndex })));
    setSaveMessage(null);
  };

  const addItem = (sectionId: string) => {
    const section = sections.find((item) => item.id === sectionId);
    if (!section) return;
    const items = section.content.items || [];
    updateSectionContent(sectionId, {
      items: [
        ...items,
        {
          id: makeLocalId(),
          title: 'Judul baru',
          subtitle: 'Institusi / Perusahaan',
          meta: 'Periode',
          description: 'Detail singkat.',
        },
      ],
    });
  };

  const updateItem = (sectionId: string, itemId: string, field: keyof CVItem, value: string) => {
    const section = sections.find((item) => item.id === sectionId);
    if (!section) return;
    updateSectionContent(sectionId, {
      items: (section.content.items || []).map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    });
  };

  const removeItem = (sectionId: string, itemId: string) => {
    const section = sections.find((item) => item.id === sectionId);
    if (!section) return;
    updateSectionContent(sectionId, {
      items: (section.content.items || []).filter((item) => item.id !== itemId),
    });
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('File foto harus berupa gambar.');
      return;
    }
    if (file.size > 1_500_000) {
      setErrorMsg('Ukuran foto maksimal 1.5 MB agar CV tetap ringan.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateSectionContent(personalSection.id, { photoUrl: String(reader.result || '') });
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!cv) return;
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setErrorMsg('Judul CV tidak boleh kosong.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    setSaveMessage(null);

    try {
      await cvsApi.update(cv.id, { title: cleanTitle, templateType });

      for (const sectionId of deletedSectionIds) {
        await cvsApi.sections.delete(cv.id, sectionId);
      }

      const sortedSections = sections.map((section, orderIndex) => ({ ...section, orderIndex }));
      for (const section of sortedSections) {
        const payload = {
          type: section.type,
          title: section.title,
          orderIndex: section.orderIndex,
          isVisible: section.isVisible ?? true,
          content: section.content,
        };

        if (section.id.startsWith('local-')) {
          await cvsApi.sections.create(cv.id, payload);
        } else {
          await cvsApi.sections.update(cv.id, section.id, payload);
        }
      }

      const refreshed = await cvsApi.getById(cv.id);
      const normalized = normalizeSections(refreshed.sections, user);
      setCv(refreshed);
      setTitle(refreshed.title);
      setTemplateType(normalizeTemplate(refreshed.templateType));
      setSections(normalized);
      setDeletedSectionIds([]);
      setSaveMessage('Perubahan CV berhasil disimpan.');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Gagal menyimpan CV.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <div className="p-8">Memuat CV...</div>;
  if (!cv) return null;

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <div className="no-print h-16 bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/cv" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors font-bold text-neutral-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <input
              className="font-bold text-neutral-900 leading-none bg-transparent outline-none border-b border-transparent focus:border-primary-400 max-w-[52vw] sm:max-w-sm"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setSaveMessage(null);
              }}
            />
            <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mt-1">
              {saveMessage ? 'Tersimpan' : 'Editor CV'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="px-4 gap-2" onClick={handlePrint}>
            <Download className="w-4 h-4" />
            PDF
          </Button>
          <Button variant="primary" size="sm" className="px-4 gap-2" onClick={handleSave} isLoading={isSaving}>
            <Save className="w-4 h-4" />
            Simpan
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[460px_minmax(0,1fr)] overflow-hidden">
        <div className="no-print bg-white border-r border-neutral-200 overflow-y-auto p-4 sm:p-6 space-y-6">
          {(errorMsg || saveMessage) && (
            <div
              className={`p-4 rounded-xl border text-sm font-medium ${
                errorMsg ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
              }`}
            >
              {errorMsg || saveMessage}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-neutral-900">Template</h2>
              <span className="badge-neutral">{templateType}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATE_OPTIONS.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => {
                    setTemplateType(template.id);
                    setSaveMessage(null);
                  }}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    templateType === template.id
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-100'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <div className="h-16 bg-white border border-neutral-200 rounded-lg p-2 mb-2">
                    <div className={`h-2 rounded ${template.id === 'CLASSIC' ? 'bg-neutral-800' : template.id === 'CREATIVE' ? 'bg-accent-400' : 'bg-primary-600'}`} />
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-3/4 bg-neutral-200 rounded" />
                      <div className="h-1.5 w-1/2 bg-neutral-100 rounded" />
                      <div className="h-1.5 w-full bg-neutral-100 rounded" />
                    </div>
                  </div>
                  <div className="text-xs font-bold text-neutral-900">{template.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-4">
            <h2 className="font-bold text-neutral-900 mb-4">Informasi Pribadi</h2>
            <div className="flex items-center gap-4 mb-5">
              <AvatarPreview personal={personalSection.content} size="lg" />
              <div>
                <label className="btn-secondary btn-sm cursor-pointer gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Foto
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
                {personalSection.content.photoUrl && (
                  <button
                    type="button"
                    onClick={() => updateSectionContent(personalSection.id, { photoUrl: '' })}
                    className="block text-xs text-red-500 font-bold mt-2"
                  >
                    Hapus foto
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <EditorInput label="Nama Lengkap" value={personalSection.content.fullName} onChange={(value) => updateSectionContent(personalSection.id, { fullName: value })} />
              <EditorInput label="Headline" value={personalSection.content.headline} onChange={(value) => updateSectionContent(personalSection.id, { headline: value })} />
              <EditorInput label="Email" value={personalSection.content.email} onChange={(value) => updateSectionContent(personalSection.id, { email: value })} />
              <EditorInput label="Telepon" value={personalSection.content.phone} onChange={(value) => updateSectionContent(personalSection.id, { phone: value })} />
              <EditorInput label="Lokasi" value={personalSection.content.location} onChange={(value) => updateSectionContent(personalSection.id, { location: value })} />
              <EditorInput label="Link Profesional" value={personalSection.content.links} onChange={(value) => updateSectionContent(personalSection.id, { links: value })} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-neutral-900">Section CV</h2>
              <span className="text-xs text-neutral-500 font-medium">{editableSections.length} section</span>
            </div>
            <div className="space-y-2">
              {editableSections.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSectionId(section.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
                    activeSectionId === section.id
                      ? 'border-primary-400 bg-primary-50 text-primary-900'
                      : 'border-neutral-200 bg-white hover:border-primary-200'
                  }`}
                >
                  <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-500 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold truncate">{section.title}</span>
                    <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">{section.type}</span>
                  </span>
                  {section.isVisible === false ? <EyeOff className="w-4 h-4 text-neutral-400" /> : <Eye className="w-4 h-4 text-primary-600" />}
                </button>
              ))}
            </div>
          </div>

          {activeSection && (
            <div className="border border-neutral-200 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 rounded-lg hover:bg-neutral-100" onClick={() => moveSection(activeSection.id, -1)} title="Naikkan section">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button type="button" className="p-2 rounded-lg hover:bg-neutral-100" onClick={() => moveSection(activeSection.id, 1)} title="Turunkan section">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-neutral-100"
                  onClick={() => updateSection(activeSection.id, { isVisible: activeSection.isVisible === false })}
                  title={activeSection.isVisible === false ? 'Tampilkan section' : 'Sembunyikan section'}
                >
                  {activeSection.isVisible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 ml-auto"
                  onClick={() => removeSection(activeSection.id)}
                  title="Hapus section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <EditorInput label="Judul Section" value={activeSection.title} onChange={(value) => updateSection(activeSection.id, { title: value })} />
              {renderSectionEditor(activeSection, updateSectionContent, addItem, updateItem, removeItem)}
            </div>
          )}

          <div className="border border-dashed border-neutral-300 rounded-2xl p-4">
            <h2 className="font-bold text-neutral-900 mb-3">Tambah Section</h2>
            <div className="grid grid-cols-2 gap-2">
              {SECTION_LIBRARY.map((item) => (
                <button
                  key={`${item.type}-${item.title}`}
                  type="button"
                  onClick={() => addSection(item.type, item.title)}
                  className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-bold text-neutral-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {item.button}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-auto bg-neutral-200/70 p-4 sm:p-8">
          <div className="no-print max-w-4xl mx-auto mb-4 text-center text-sm text-neutral-600">
            Preview mengikuti template aktif. Tombol PDF memakai dialog cetak browser.
          </div>
          {renderPreview(templateType, personalSection.content, sections)}
        </div>
      </div>
    </div>
  );
}

function EditorInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label mb-1.5">{label}</label>
      <input className="input py-2.5" value={value || ''} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function EditorTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label mb-1.5">{label}</label>
      <textarea
        className="input min-h-28 py-3 leading-relaxed"
        value={value || ''}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function renderSectionEditor(
  section: EditorSection,
  updateContent: (sectionId: string, patch: Partial<CVSectionContent>) => void,
  addItem: (sectionId: string) => void,
  updateItem: (sectionId: string, itemId: string, field: keyof CVItem, value: string) => void,
  removeItem: (sectionId: string, itemId: string) => void,
) {
  if (section.type === 'summary') {
    return (
      <EditorTextarea
        label="Isi Ringkasan"
        value={section.content.body}
        onChange={(value) => updateContent(section.id, { body: value })}
      />
    );
  }

  if (section.type === 'skill') {
    return (
      <EditorTextarea
        label="Daftar Keahlian"
        value={section.content.skills}
        onChange={(value) => updateContent(section.id, { skills: value })}
        placeholder="Pisahkan dengan koma, contoh: React, UI Design, Komunikasi"
      />
    );
  }

  const items = section.content.items || [];

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-neutral-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-wider font-bold text-neutral-400">Item {index + 1}</div>
            <button type="button" className="text-red-500 hover:text-red-700" onClick={() => removeItem(section.id, item.id)} title="Hapus item">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <EditorInput label="Judul" value={item.title} onChange={(value) => updateItem(section.id, item.id, 'title', value)} />
          <EditorInput label="Subjudul" value={item.subtitle} onChange={(value) => updateItem(section.id, item.id, 'subtitle', value)} />
          <EditorInput label="Periode / Info Kanan" value={item.meta} onChange={(value) => updateItem(section.id, item.id, 'meta', value)} />
          <EditorTextarea label="Deskripsi" value={item.description} onChange={(value) => updateItem(section.id, item.id, 'description', value)} />
        </div>
      ))}
      <button type="button" className="btn-secondary btn-sm w-full gap-2" onClick={() => addItem(section.id)}>
        <Plus className="w-4 h-4" />
        Tambah Item
      </button>
    </div>
  );
}

function AvatarPreview({ personal, size = 'md' }: { personal: CVSectionContent; size?: 'md' | 'lg' }) {
  const dimension = size === 'lg' ? 'w-20 h-20' : 'w-16 h-16';
  const textSize = size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <div className={`${dimension} rounded-2xl overflow-hidden bg-primary-100 text-primary-700 border border-primary-200 flex items-center justify-center shrink-0`}>
      {personal.photoUrl ? (
        <img src={personal.photoUrl} alt={personal.fullName || 'Foto profil'} className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <ImageIcon className="w-5 h-5" />
          <span className={`${textSize} font-black`}>{getInitials(personal.fullName)}</span>
        </div>
      )}
    </div>
  );
}

function visibleBodySections(sections: EditorSection[]) {
  return sections.filter((section) => !isPersonalSection(section) && section.isVisible !== false);
}

function renderPreview(templateType: CVTemplateType, personal: CVSectionContent, sections: EditorSection[]) {
  if (templateType === 'CLASSIC') return <ClassicPreview personal={personal} sections={sections} />;
  if (templateType === 'CREATIVE') return <CreativePreview personal={personal} sections={sections} />;
  return <ModernPreview personal={personal} sections={sections} />;
}

function ModernPreview({ personal, sections }: { personal: CVSectionContent; sections: EditorSection[] }) {
  return (
    <div className="print-area bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] p-[15mm] relative text-neutral-800">
      <div className="flex justify-between gap-8 border-b-4 border-primary-600 pb-7 mb-8">
        <div className="min-w-0">
          <div className="text-4xl font-black text-neutral-950 tracking-tight leading-tight">{personal.fullName || 'Nama Lengkap'}</div>
          <div className="mt-2 text-primary-700 font-bold uppercase tracking-wider text-sm">{personal.headline || 'Headline Profesional'}</div>
          <PreviewContact personal={personal} className="mt-4 text-xs text-neutral-600 flex flex-wrap gap-x-3 gap-y-1" />
        </div>
        <AvatarPreview personal={personal} size="lg" />
      </div>

      <div className="space-y-7">{visibleBodySections(sections).map((section) => renderSectionPreview(section, 'modern'))}</div>
    </div>
  );
}

function ClassicPreview({ personal, sections }: { personal: CVSectionContent; sections: EditorSection[] }) {
  return (
    <div className="print-area bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] p-[17mm] relative text-neutral-900 font-serif">
      <div className="text-center border-b border-neutral-900 pb-6 mb-7">
        <div className="mx-auto mb-4 w-fit">
          <AvatarPreview personal={personal} />
        </div>
        <div className="text-4xl font-bold tracking-wide uppercase">{personal.fullName || 'Nama Lengkap'}</div>
        <div className="mt-2 text-sm uppercase tracking-[0.22em] text-neutral-600">{personal.headline || 'Headline Profesional'}</div>
        <PreviewContact personal={personal} className="mt-4 text-xs text-neutral-600 flex flex-wrap justify-center gap-x-4 gap-y-1" />
      </div>

      <div className="space-y-6">{visibleBodySections(sections).map((section) => renderSectionPreview(section, 'classic'))}</div>
    </div>
  );
}

function CreativePreview({ personal, sections }: { personal: CVSectionContent; sections: EditorSection[] }) {
  const skillSection = visibleBodySections(sections).find((section) => section.type === 'skill');
  const mainSections = visibleBodySections(sections).filter((section) => section.type !== 'skill');

  return (
    <div className="print-area bg-white shadow-2xl mx-auto w-[210mm] min-h-[297mm] relative text-neutral-800 overflow-hidden">
      <div className="grid grid-cols-[70mm_1fr] min-h-[297mm]">
        <div className="bg-primary-900 text-white p-[12mm]">
          <AvatarPreview personal={personal} size="lg" />
          <div className="mt-7 text-3xl font-black leading-tight">{personal.fullName || 'Nama Lengkap'}</div>
          <div className="mt-3 text-accent-300 font-bold text-sm uppercase tracking-wider">{personal.headline || 'Headline Profesional'}</div>

          <div className="mt-8">
            <div className="text-xs uppercase tracking-[0.2em] text-primary-100 font-black mb-3">Kontak</div>
            <PreviewContact personal={personal} className="text-xs text-primary-50 space-y-2" stacked />
          </div>

          {skillSection && (
            <div className="mt-8">
              <div className="text-xs uppercase tracking-[0.2em] text-primary-100 font-black mb-3">{skillSection.title}</div>
              <div className="flex flex-wrap gap-2">
                {splitLines(skillSection.content.skills).map((skill) => (
                  <span key={skill} className="px-2 py-1 rounded-md bg-white/10 text-[11px] font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-[14mm] space-y-7">{mainSections.map((section) => renderSectionPreview(section, 'creative'))}</div>
      </div>
    </div>
  );
}

function PreviewContact({
  personal,
  className,
  stacked = false,
}: {
  personal: CVSectionContent;
  className?: string;
  stacked?: boolean;
}) {
  const items = [personal.email, personal.phone, personal.location, personal.links].filter(Boolean);
  if (stacked) {
    return (
      <div className={className}>
        {items.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    );
  }
  return (
    <div className={className}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function renderSectionPreview(section: EditorSection, variant: 'modern' | 'classic' | 'creative') {
  const titleClass =
    variant === 'classic'
      ? 'text-sm font-bold uppercase tracking-[0.18em] border-b border-neutral-900 pb-1 mb-3'
      : variant === 'creative'
        ? 'text-sm font-black uppercase tracking-wider text-primary-800 border-b-2 border-accent-400 pb-1 mb-3'
        : 'text-sm font-black uppercase tracking-wider text-primary-800 border-b border-primary-200 pb-1 mb-3';

  return (
    <div key={section.id}>
      <div className={titleClass}>{section.title}</div>
      {section.type === 'summary' && (
        <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line">{section.content.body}</p>
      )}
      {section.type === 'skill' && (
        <div className="flex flex-wrap gap-2">
          {splitLines(section.content.skills).map((skill) => (
            <span key={skill} className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 text-xs font-bold">
              {skill}
            </span>
          ))}
        </div>
      )}
      {itemSectionTypes.has(section.type) && section.type !== 'skill' && (
        <div className="space-y-4">
          {(section.content.items || []).map((item) => (
            <div key={item.id}>
              <div className="flex justify-between gap-4 items-baseline">
                <div className="font-bold text-neutral-900">{item.title}</div>
                <div className="text-xs font-bold text-neutral-500 shrink-0">{item.meta}</div>
              </div>
              {item.subtitle && <div className="text-sm font-semibold text-primary-700 mt-0.5">{item.subtitle}</div>}
              {item.description && <p className="text-sm leading-relaxed text-neutral-700 mt-1 whitespace-pre-line">{item.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
