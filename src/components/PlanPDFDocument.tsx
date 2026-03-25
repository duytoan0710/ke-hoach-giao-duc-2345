import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, usePDF } from '@react-pdf/renderer';

// Register font
Font.register({
  family: 'Times New Roman',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/apache/tinos/Tinos-Regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/apache/tinos/Tinos-Bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/apache/tinos/Tinos-Italic.ttf', fontStyle: 'italic' },
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/apache/tinos/Tinos-BoldItalic.ttf', fontWeight: 'bold', fontStyle: 'italic' }
  ]
});

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 60, // 3cm left margin
    paddingRight: 40, // 2cm right margin
    fontFamily: 'Times New Roman',
    fontSize: 14, // Standard font size
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerLeft: {
    width: '45%',
    textAlign: 'center',
  },
  headerRight: {
    width: '55%',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecoration: 'underline',
  },
  titleContainer: {
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  h1: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  h2: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  h3: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 6,
    marginBottom: 3,
  },
  paragraph: {
    marginBottom: 8,
    textAlign: 'justify',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 15,
    textAlign: 'justify',
  },
  bullet: {
    width: 15,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    margin: 5,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  footerLeft: {
    width: '40%',
  },
  footerRight: {
    width: '40%',
    textAlign: 'center',
  },
});

interface AdminInfo {
  date?: string;
  schoolName?: string;
  departmentName?: string;
  planNumber?: string;
  location?: string;
  schoolYear?: string;
  principalName?: string;
}

interface PlanPDFDocumentProps {
  adminInfo: AdminInfo;
  stepBlocks: any;
  STEPS: any;
}

export const PlanPDFDocument: React.FC<PlanPDFDocumentProps> = ({ adminInfo = {} as AdminInfo, stepBlocks = {}, STEPS = [] }) => {
  let dateObj = new Date();
  if (adminInfo.date) {
    const parsedDate = new Date(adminInfo.date);
    if (!isNaN(parsedDate.getTime())) {
      dateObj = parsedDate;
    }
  }
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();

  const schoolInitials = adminInfo.schoolName 
    ? adminInfo.schoolName.split(' ').filter(Boolean).map((w: string) => w[0]).join('').toUpperCase() 
    : '...';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text>{adminInfo.departmentName?.toUpperCase() || 'PHÒNG GDĐT...'}</Text>
            <Text style={[styles.bold, styles.underline]}>{adminInfo.schoolName?.toUpperCase() || 'TRƯỜNG...'}</Text>
            <Text style={{ marginTop: 5 }}>Số: {adminInfo.planNumber || '...'}/KH-{schoolInitials}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.bold}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
            <Text style={[styles.bold, styles.underline]}>Độc lập - Tự do - Hạnh phúc</Text>
            <Text style={[styles.italic, { marginTop: 5 }]}>
              {adminInfo.location || '...'}, ngày {day} tháng {month} năm {year}
            </Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>KẾ HOẠCH GIÁO DỤC NHÀ TRƯỜNG</Text>
          <Text style={styles.subtitle}>Năm học {adminInfo.schoolYear || '...'}</Text>
        </View>

        {/* Content */}
        {Object.entries(stepBlocks).map(([stepId, blocks]: [string, any]) => {
          if (blocks.length === 0) return null;
          const stepTitle = STEPS[parseInt(stepId) - 1]?.title;
          
          return (
            <View key={stepId} style={{ marginBottom: 15 }}>
              {stepTitle ? (
                <Text style={styles.sectionTitle}>{stepTitle}</Text>
              ) : null}
              
              {blocks.map((block: any) => {
                switch (block.type) {
                  case 'h1':
                    return <Text key={block.id} style={styles.h1}>{block.content || ''}</Text>;
                  case 'h2':
                    return <Text key={block.id} style={styles.h2}>{block.content || ''}</Text>;
                  case 'h3':
                    return <Text key={block.id} style={styles.h3}>{block.content || ''}</Text>;
                  case 'text':
                    return <Text key={block.id} style={styles.paragraph}>{block.content || ''}</Text>;
                  case 'list':
                    if (!Array.isArray(block.content)) return null;
                    return (
                      <View key={block.id}>
                        {block.content.map((item: string, i: number) => (
                          <View key={i} style={styles.listItem}>
                            <Text style={styles.bullet}>-</Text>
                            <Text style={{ flex: 1, textAlign: 'justify' }}>{item || ''}</Text>
                          </View>
                        ))}
                      </View>
                    );
                  case 'table':
                    if (!block.content || !block.content.headers || !block.content.rows || block.content.headers.length === 0) return null;
                    const colWidth = `${100 / block.content.headers.length}%`;
                    return (
                      <View key={block.id} style={styles.table}>
                        <View style={styles.tableRow}>
                          {block.content.headers.map((h: string, i: number) => (
                            <View key={i} style={[styles.tableColHeader, { width: colWidth }]}>
                              <Text style={styles.tableCellHeader}>{h || ''}</Text>
                            </View>
                          ))}
                        </View>
                        {block.content.rows.map((row: string[], rIdx: number) => (
                          <View key={rIdx} style={styles.tableRow}>
                            {row.map((cell: string, cIdx: number) => (
                              <View key={cIdx} style={[styles.tableCol, { width: colWidth }]}>
                                <Text style={styles.tableCell}>{cell || ''}</Text>
                              </View>
                            ))}
                          </View>
                        ))}
                      </View>
                    );
                  default:
                    return null;
                }
              })}
            </View>
          );
        })}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={[styles.bold, styles.italic, { marginBottom: 5 }]}>Nơi nhận:</Text>
            <Text style={styles.italic}>- Như trên;</Text>
            <Text style={styles.italic}>- Lưu: VT.</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={[styles.bold, { marginBottom: 60 }]}>HIỆU TRƯỞNG</Text>
            <Text style={styles.bold}>{adminInfo.principalName || '...'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
