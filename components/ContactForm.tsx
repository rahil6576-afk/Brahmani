'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, CheckCircle2, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { BRAND } from '@/lib/constants';
import { useTheme } from './ThemeProvider';
import MagneticButton from './MagneticButton';

function ContactFormInner() {
  const { theme, isNight } = useTheme();

  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service');
  const productParam = searchParams.get('product');

  const [formData, setFormData] = useState({
    projectType: 'Commercial Solar Installation',
    projectScale: '50 kW to 250 kW',
    name: '',
    company: '',
    email: '',
    phone: '',
    location: 'Gujarat, India',
    message: '',
  });

  useEffect(() => {
    if (serviceParam) {
      setFormData((prev) => ({
        ...prev,
        projectType: serviceParam,
        message: `Inquiring about ${serviceParam} engineering scope.`,
      }));
    } else if (productParam) {
      setFormData((prev) => ({
        ...prev,
        projectType: 'Equipment Procurement',
        message: `Requesting official datasheet & quotation for ${productParam}.`,
      }));
    }
  }, [serviceParam, productParam]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; phone?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; phone?: boolean }>({});

  const validateEmail = (val: string) => {
    const trimmed = (val || '').trim();
    if (!trimmed) return 'Official email address is required.';
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address (e.g. name@company.com).';
    }
    return '';
  };

  const validatePhone = (val: string) => {
    const trimmed = (val || '').trim();
    if (!trimmed) return 'Direct phone number is required.';
    const digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return 'Phone number must contain at least 10 digits (e.g. +91 98765 43210).';
    }
    if (digitsOnly.length > 15) {
      return 'Phone number cannot exceed 15 digits.';
    }
    const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,18}$/;
    if (!phonePattern.test(trimmed)) {
      return 'Please enter a valid phone number format.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(formData.email);
    const phoneErr = validatePhone(formData.phone);
    if (emailErr || phoneErr) {
      setFormErrors({ email: emailErr, phone: phoneErr });
      setTouched({ email: true, phone: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.fieldErrors) {
          setFormErrors(data.fieldErrors);
          setTouched({ email: true, phone: true });
          return;
        }
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit inquiry to server:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      
      {/* LEFT: 4-STAGE ENGINEERING CONSULTATION WORKBENCH (7 cols) */}
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.7, ease: [0.21, 1, 0.36, 1] }}
        className={`lg:col-span-7 border p-6 sm:p-10 relative transition-colors duration-700 ${
          isNight
            ? 'bg-[#0E1318] border-[#222B34]'
            : 'bg-[#FFFFFF] border-[#E2E0D8] shadow-sm'
        }`}
      >
        <div
          className={`flex items-center justify-between border-b pb-5 mb-8 ${
            isNight ? 'border-[#1E2620]' : 'border-[#E8E6DE]'
          }`}
        >
          <div>
            <span
              className={`text-[10px] font-mono tracking-widest uppercase block ${
                isNight ? 'text-[#77838E]' : 'text-[#7B8894]'
              }`}
            >
              ENGINEERING CONSULTATION INTAKE
            </span>
            <h3
              className={`text-2xl font-extrabold uppercase tracking-tight mt-1 transition-colors ${
                isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
              }`}
            >
              START YOUR PROJECT
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFC107]">
            <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
            <span>SLA ACTIVE</span>
          </div>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 flex flex-col items-center text-center space-y-4"
          >
            <div
              className={`w-16 h-16 rounded-full border flex items-center justify-center text-[#FFC107] shadow-[0_0_20px_rgba(255,193,7,0.3)] ${
                isNight ? 'bg-[#182129] border-[#FFC107]/50' : 'bg-[#FFF9E6] border-[#FFC107]'
              }`}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4
              className={`text-xl font-bold uppercase tracking-tight ${
                isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
              }`}
            >
              PROJECT BRIEF LOGGED
            </h4>
            <p
              className={`text-sm max-w-md leading-relaxed ${
                isNight ? 'text-[#8E97A0]' : 'text-[#55626F]'
              }`}
            >
              Thank you, <span className={isNight ? 'text-[#F5F5F2] font-semibold' : 'text-[#11161A] font-semibold'}>{formData.name}</span>. A licensed Brahmani electrical engineering consultant will evaluate your load specifications and contact you within 24 hours.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    projectType: 'Commercial Solar Installation',
                    projectScale: '50 kW to 250 kW',
                    name: '',
                    company: '',
                    email: '',
                    phone: '',
                    location: 'Gujarat, India',
                    message: '',
                  });
                }}
                className={`px-6 py-2.5 border text-xs font-mono uppercase transition-colors ${
                  isNight
                    ? 'bg-[#141B22] border-[#232C35] hover:border-[#FFC107] text-[#F5F5F2]'
                    : 'bg-[#F4F3EE] border-[#DDDCD4] hover:border-[#FFC107] text-[#11161A]'
                }`}
              >
                LOG ANOTHER BRIEF
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* STAGE 01: PROJECT TYPE */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#FFC107] font-bold">01</span>
                <label
                  className={`text-xs font-mono font-bold tracking-wider uppercase block ${
                    isNight ? 'text-[#ECEBE6]' : 'text-[#242E38]'
                  }`}
                >
                  PROJECT TYPE
                </label>
              </div>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className={`w-full border focus:border-[#FFC107] focus:outline-none px-4 py-3 text-sm transition-colors cursor-pointer ${
                  isNight
                    ? 'bg-[#12181E] border-[#222C36] text-[#F5F5F2]'
                    : 'bg-[#F9F8F5] border-[#DEDCD4] text-[#11161A]'
                }`}
              >
                <option value="Commercial Solar Installation">Commercial Solar Installation (Rooftop / Ground Mount)</option>
                <option value="Industrial Electrical Systems">Industrial Electrical Infrastructure (HT / LT)</option>
                <option value="Substation & Switchgear">Substation, Transformer &amp; Switchgear Automation</option>
                <option value="Preventive Maintenance & AMC">Preventive Maintenance &amp; 24/7 AMC Contract</option>
                <option value="Energy Audit & APFC Panels">Energy Audit &amp; Power Factor Correction</option>
                <option value="Equipment Procurement">Hardware &amp; Equipment Procurement</option>
              </select>
            </div>

            {/* STAGE 02: PROJECT SCALE */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#FFC107] font-bold">02</span>
                <label
                  className={`text-xs font-mono font-bold tracking-wider uppercase block ${
                    isNight ? 'text-[#ECEBE6]' : 'text-[#242E38]'
                  }`}
                >
                  PROJECT SCALE / ELECTRICAL LOAD
                </label>
              </div>
              <select
                value={formData.projectScale}
                onChange={(e) => setFormData({ ...formData, projectScale: e.target.value })}
                className={`w-full border focus:border-[#FFC107] focus:outline-none px-4 py-3 text-sm transition-colors cursor-pointer ${
                  isNight
                    ? 'bg-[#12181E] border-[#222C36] text-[#F5F5F2]'
                    : 'bg-[#F9F8F5] border-[#DEDCD4] text-[#11161A]'
                }`}
              >
                <option value="Under 50 kW">Under 50 kW (Commercial / Small Enterprise)</option>
                <option value="50 kW to 250 kW">50 kW to 250 kW (Medium Factory / Facility)</option>
                <option value="250 kW to 1 MW">250 kW to 1 MW (Large Manufacturing Plant)</option>
                <option value="Above 1 MW Utility">Above 1 MW (Utility Scale / Industrial Park)</option>
                <option value="Consultation Needed">To be determined by Brahmani site audit</option>
              </select>
            </div>

            {/* STAGE 03: LOCATION & CONTACT DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#FFC107] font-bold">03</span>
                <span
                  className={`text-xs font-mono font-bold tracking-wider uppercase block ${
                    isNight ? 'text-[#ECEBE6]' : 'text-[#242E38]'
                  }`}
                >
                  CONTACT &amp; SITE LOCATION
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#7D8893] uppercase block">
                    FULL NAME <span className="text-[#FFC107]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full border focus:border-[#FFC107] focus:outline-none px-3.5 py-2.5 text-sm transition-colors ${
                      isNight
                        ? 'bg-[#12181E] border-[#222C36] text-[#F5F5F2] placeholder-[#55616C]'
                        : 'bg-[#F9F8F5] border-[#DEDCD4] text-[#11161A] placeholder-[#909AA4]'
                    }`}
                  />
                </div>

                {/* Company */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#7D8893] uppercase block">
                    COMPANY / ENTITY
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Industrial Works"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={`w-full border focus:border-[#FFC107] focus:outline-none px-3.5 py-2.5 text-sm transition-colors ${
                      isNight
                        ? 'bg-[#12181E] border-[#222C36] text-[#F5F5F2] placeholder-[#55616C]'
                        : 'bg-[#F9F8F5] border-[#DEDCD4] text-[#11161A] placeholder-[#909AA4]'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-[#7D8893] uppercase block">
                      EMAIL ADDRESS <span className="text-[#FFC107]">*</span>
                    </label>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="r.patel@company.com"
                    value={formData.email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({ ...prev, email: val }));
                      if (touched.email) {
                        setFormErrors((prev) => ({ ...prev, email: validateEmail(val) }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, email: true }));
                      setFormErrors((prev) => ({ ...prev, email: validateEmail(formData.email) }));
                    }}
                    className={`w-full border focus:outline-none px-3.5 py-2.5 text-sm transition-colors ${
                      touched.email && formErrors.email
                        ? 'border-red-500 focus:border-red-500 bg-red-500/5'
                        : isNight
                        ? 'bg-[#12181E] border-[#222C36] text-[#F5F5F2] placeholder-[#55616C] focus:border-[#FFC107]'
                        : 'bg-[#F9F8F5] border-[#DEDCD4] text-[#11161A] placeholder-[#909AA4] focus:border-[#FFC107]'
                    }`}
                  />
                  {touched.email && formErrors.email && (
                    <p className="text-[11px] font-mono text-red-500 mt-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-[#7D8893] uppercase block">
                      PHONE NUMBER <span className="text-[#FFC107]">*</span>
                    </label>
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({ ...prev, phone: val }));
                      if (touched.phone) {
                        setFormErrors((prev) => ({ ...prev, phone: validatePhone(val) }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, phone: true }));
                      setFormErrors((prev) => ({ ...prev, phone: validatePhone(formData.phone) }));
                    }}
                    className={`w-full border focus:outline-none px-3.5 py-2.5 text-sm transition-colors ${
                      touched.phone && formErrors.phone
                        ? 'border-red-500 focus:border-red-500 bg-red-500/5'
                        : isNight
                        ? 'bg-[#12181E] border-[#222C36] text-[#F5F5F2] placeholder-[#55616C] focus:border-[#FFC107]'
                        : 'bg-[#F9F8F5] border-[#DEDCD4] text-[#11161A] placeholder-[#909AA4] focus:border-[#FFC107]'
                    }`}
                  />
                  {touched.phone && formErrors.phone && (
                    <p className="text-[11px] font-mono text-red-500 mt-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Site Location */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#7D8893] uppercase block">
                  FACILITY / SITE LOCATION
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sanand GIDC / Ahmedabad, Gujarat"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full border focus:border-[#FFC107] focus:outline-none px-3.5 py-2.5 text-sm transition-colors ${
                    isNight
                      ? 'bg-[#12181E] border-[#222C36] text-[#F5F5F2] placeholder-[#55616C]'
                      : 'bg-[#F9F8F5] border-[#DEDCD4] text-[#11161A] placeholder-[#909AA4]'
                  }`}
                />
              </div>
            </div>

            {/* STAGE 04: TECHNICAL REQUIREMENTS */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#FFC107] font-bold">04</span>
                <label
                  className={`text-xs font-mono font-bold tracking-wider uppercase block ${
                    isNight ? 'text-[#ECEBE6]' : 'text-[#242E38]'
                  }`}
                >
                  TECHNICAL SCOPE &amp; REQUIREMENTS <span className="text-[#FFC107]">*</span>
                </label>
              </div>
              <textarea
                required
                rows={3}
                placeholder="Describe your target timeline, current power factor, transformer ratings, or specific equipment requirements..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full border focus:border-[#FFC107] focus:outline-none p-3.5 text-sm transition-colors resize-none ${
                  isNight
                    ? 'bg-[#12181E] border-[#222C36] text-[#F5F5F2] placeholder-[#55616C]'
                    : 'bg-[#F9F8F5] border-[#DEDCD4] text-[#11161A] placeholder-[#909AA4]'
                }`}
              />
            </div>

            {/* Submit Button */}
            <MagneticButton className="w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group inline-flex items-center justify-center gap-2.5 py-4 bg-[#FFC107] hover:bg-[#E6A900] disabled:opacity-60 text-[#0A0D0F] font-bold text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_-4px_rgba(255,193,7,0.4)]"
              >
                <span>{isSubmitting ? 'TRANSMITTING PROJECT BRIEF...' : 'SEND REQUEST →'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </MagneticButton>
          </form>
        )}
      </motion.div>

      {/* RIGHT: HEADQUARTERS & TECHNICAL DETAILS (5 cols) */}
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.7, delay: 0.12, ease: [0.21, 1, 0.36, 1] }}
        className="lg:col-span-5 flex flex-col justify-between space-y-8"
      >
        {/* Contact Info Card */}
        <div
          className={`border p-6 sm:p-8 space-y-6 transition-colors duration-700 ${
            isNight
              ? 'bg-[#0E1318] border-[#222B34]'
              : 'bg-[#FFFFFF] border-[#E2E0D8] shadow-sm'
          }`}
        >
          <div
            className={`border-b pb-4 ${
              isNight ? 'border-[#1E2620]' : 'border-[#E8E6DE]'
            }`}
          >
            <span
              className={`text-[10px] font-mono tracking-widest uppercase block ${
                isNight ? 'text-[#77838E]' : 'text-[#7B8894]'
              }`}
            >
              ENGINEERING HEADQUARTERS
            </span>
            <h3
              className={`text-xl font-extrabold uppercase tracking-tight mt-1 transition-colors ${
                isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
              }`}
            >
              DIRECT ENGINEERING LINES
            </h3>
          </div>

          <div className="space-y-5 text-sm">
            {/* Phone */}
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 border flex items-center justify-center text-[#FFC107] shrink-0 ${
                  isNight
                    ? 'bg-[#141B22] border-[#242E38]'
                    : 'bg-[#F7F6F1] border-[#DDDCD4]'
                }`}
              >
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span
                  className={`text-[10px] font-mono uppercase block tracking-wider ${
                    isNight ? 'text-[#66727E]' : 'text-[#7E8B97]'
                  }`}
                >
                  CENTRAL DESK
                </span>
                <a
                  href={`tel:${BRAND.contact.phone.replace(/\s+/g, '')}`}
                  className={`font-semibold hover:text-[#FFC107] transition-colors block ${
                    isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                  }`}
                >
                  {BRAND.contact.phone}
                </a>
                <a
                  href={`tel:${BRAND.contact.phoneMobile.replace(/\s+/g, '')}`}
                  className={`text-xs hover:text-[#FFC107] transition-colors block ${
                    isNight ? 'text-[#8E97A0]' : 'text-[#5C6873]'
                  }`}
                >
                  {BRAND.contact.phoneMobile} (Mobile / WhatsApp)
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 border flex items-center justify-center text-[#FFC107] shrink-0 ${
                  isNight
                    ? 'bg-[#141B22] border-[#242E38]'
                    : 'bg-[#F7F6F1] border-[#DDDCD4]'
                }`}
              >
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span
                  className={`text-[10px] font-mono uppercase block tracking-wider ${
                    isNight ? 'text-[#66727E]' : 'text-[#7E8B97]'
                  }`}
                >
                  OFFICIAL INQUIRIES
                </span>
                <a
                  href={`mailto:${BRAND.contact.email}`}
                  className={`font-semibold hover:text-[#FFC107] transition-colors block ${
                    isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                  }`}
                >
                  {BRAND.contact.email}
                </a>
                <span
                  className={`text-[11px] block font-mono ${
                    isNight ? 'text-[#6A7682]' : 'text-[#7F8B96]'
                  }`}
                >
                  SLA Response: &lt; 24 business hours
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 border flex items-center justify-center text-[#FFC107] shrink-0 ${
                  isNight
                    ? 'bg-[#141B22] border-[#242E38]'
                    : 'bg-[#F7F6F1] border-[#DDDCD4]'
                }`}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span
                  className={`text-[10px] font-mono uppercase block tracking-wider ${
                    isNight ? 'text-[#66727E]' : 'text-[#7E8B97]'
                  }`}
                >
                  OFFICE LOCATION
                </span>
                <p
                  className={`font-semibold leading-snug ${
                    isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                  }`}
                >
                  {BRAND.contact.address}
                </p>
                <span className="text-xs text-[#FFC107] font-mono mt-1 block">
                  {BRAND.contact.city}
                </span>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 border flex items-center justify-center text-[#FFC107] shrink-0 ${
                  isNight
                    ? 'bg-[#141B22] border-[#242E38]'
                    : 'bg-[#F7F6F1] border-[#DDDCD4]'
                }`}
              >
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span
                  className={`text-[10px] font-mono uppercase block tracking-wider ${
                    isNight ? 'text-[#66727E]' : 'text-[#7E8B97]'
                  }`}
                >
                  OPERATIONAL HOURS
                </span>
                <p className={`text-xs ${isNight ? 'text-[#ECEBE6]' : 'text-[#2B3540]'}`}>
                  {BRAND.contact.hours}
                </p>
                <span
                  className={`text-[10px] block font-mono ${
                    isNight ? 'text-[#6A7682]' : 'text-[#7F8B96]'
                  }`}
                >
                  Emergency Breakdown Line: 24/7 Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Coverage Grid Simulation */}
        <div
          className={`border p-5 relative overflow-hidden transition-colors duration-700 ${
            isNight
              ? 'bg-[#0B0F13] border-[#222B34]'
              : 'bg-[#FFFFFF] border-[#E2E0D8]'
          }`}
        >
          <div
            className={`flex items-center justify-between text-xs font-mono mb-3 ${
              isNight ? 'text-[#7D8893]' : 'text-[#64707D]'
            }`}
          >
            <span>REGIONAL JURISDICTION</span>
            <span className="text-[#FFC107]">GUJARAT &amp; WESTERN REGION</span>
          </div>

          <div
            className={`relative h-44 w-full border overflow-hidden flex items-center justify-center ${
              isNight
                ? 'bg-[#10161C] border-[#1E262E]'
                : 'bg-[#F4F3EE] border-[#DDDCD4]'
            }`}
          >
            <div className="absolute inset-0 bg-tech-grid opacity-30" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-[#FFC107] shadow-[0_0_15px_#FFC107] animate-ping opacity-75 absolute" />
                <div className="w-4 h-4 rounded-full bg-[#FFC107] border-2 border-[#0A0D0F] relative z-10" />
              </div>
              <div
                className={`mt-2 border px-2.5 py-1 text-[11px] font-mono ${
                  isNight
                    ? 'bg-[#0A0D0F]/90 border-[#232C35] text-[#F5F5F2]'
                    : 'bg-[#FFFFFF]/95 border-[#D8D6CE] text-[#11161A]'
                }`}
              >
                BRAHMANI HQ — AHMEDABAD
              </div>
              <span className="text-[10px] font-mono text-[#FFC107] mt-0.5">
                23.0225° N, 72.5714° E
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContactForm() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#737A80] font-mono">LOADING INTAKE TERMINAL...</div>}>
      <ContactFormInner />
    </Suspense>
  );
}
