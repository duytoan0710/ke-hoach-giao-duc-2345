import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register Vietnamese-supporting font using a highly reliable CDN
Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 9, // Slightly smaller to fit more content
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 8,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    minHeight: 20,
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f8f9fa',
    padding: 4,
    textAlign: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signatureBox: {
    textAlign: 'center',
    width: '40%',
  },
  signatureTitle: {
    fontWeight: 'bold',
    marginBottom: 40,
  },
});

interface ScheduleEntry {
  id: string;
  day: string;
  date: string;
  session: 'Sáng' | 'Chiều';
  periodTKB: number;
  subject: string;
  className: string;
  periodPPCT: number;
  lessonTitle: string;
  teachingAids: string;
}

interface TeachingSchedulePDFProps {
  weekNumber: number;
  startDate: string;
  endDate: string;
  teacherName: string;
  departmentName: string;
  entries: ScheduleEntry[];
}

const TeachingSchedulePDF: React.FC<TeachingSchedulePDFProps> = ({
  weekNumber,
  startDate,
  endDate,
  teacherName,
  departmentName,
  entries,
}) => {
  // Filter out entries that are completely empty (no subject, no lesson title, no class)
  // But keep them if the user explicitly added them or if they have some data
  const displayEntries = entries.filter(e => 
    (e.subject && e.subject.trim() !== '') || 
    (e.lessonTitle && e.lessonTitle.trim() !== '') || 
    (e.className && e.className.trim() !== '') ||
    (e.teachingAids && e.teachingAids.trim() !== '')
  );

  // If no data entries, show the first 15 entries (usually the initialized ones)
  // to show the table structure at least.
  const finalEntries = displayEntries.length > 0 ? displayEntries : entries.slice(0, 15);

  return (
    <Document title={`Lich_Bao_Giang_Tuan_${weekNumber}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>LỊCH BÁO GIẢNG</Text>
          <Text style={styles.subtitle}>Tuần {weekNumber} (Từ ngày {startDate} đến ngày {endDate})</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Tổ: {departmentName || '................................'}</Text>
          <Text style={styles.infoText}>Giáo viên: {teacherName || '................................'}</Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '8%' }]}><Text>Thứ/Ngày</Text></View>
            <View style={[styles.tableColHeader, { width: '6%' }]}><Text>Buổi</Text></View>
            <View style={[styles.tableColHeader, { width: '6%' }]}><Text>Tiết TKB</Text></View>
            <View style={[styles.tableColHeader, { width: '12%' }]}><Text>Môn</Text></View>
            <View style={[styles.tableColHeader, { width: '8%' }]}><Text>Lớp</Text></View>
            <View style={[styles.tableColHeader, { width: '8%' }]}><Text>Tiết PPCT</Text></View>
            <View style={[styles.tableColHeader, { width: '32%' }]}><Text>Tên bài dạy</Text></View>
            <View style={[styles.tableColHeader, { width: '20%' }]}><Text>Đồ dùng dạy học</Text></View>
          </View>

          {/* Table Body */}
          {finalEntries.map((entry, index) => {
            const showDay = index === 0 || finalEntries[index - 1].day !== entry.day;
            const showSession = index === 0 || finalEntries[index - 1].day !== entry.day || finalEntries[index - 1].session !== entry.session;

            return (
              <View key={entry.id || index} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '8%' }]}>
                  <Text style={styles.textCenter}>{showDay ? `${entry.day || ''}\n${entry.date || ''}` : ''}</Text>
                </View>
                <View style={[styles.tableCol, { width: '6%' }]}>
                  <Text style={styles.textCenter}>{showSession ? (entry.session || '') : ''}</Text>
                </View>
                <View style={[styles.tableCol, { width: '6%' }]}>
                  <Text style={styles.textCenter}>{entry.periodTKB || ''}</Text>
                </View>
                <View style={[styles.tableCol, { width: '12%' }]}>
                  <Text>{entry.subject || ''}</Text>
                </View>
                <View style={[styles.tableCol, { width: '8%' }]}>
                  <Text style={styles.textCenter}>{entry.className || ''}</Text>
                </View>
                <View style={[styles.tableCol, { width: '8%' }]}>
                  <Text style={styles.textCenter}>{entry.periodPPCT || 0 || ''}</Text>
                </View>
                <View style={[styles.tableCol, { width: '32%' }]}>
                  <Text>{entry.lessonTitle || ''}</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text>{entry.teachingAids || ''}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>Tổ trưởng</Text>
            <Text style={{ marginTop: 30 }}>(Ký và ghi rõ họ tên)</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>Phó Hiệu trưởng</Text>
            <Text style={{ marginTop: 30 }}>(Ký và ghi rõ họ tên)</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TeachingSchedulePDF;
