import { Link } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center p-5">
      <Text variant="title" className="mb-4">This is a modal</Text>
      <Link href="/" dismissTo className="mt-4 py-4">
        <Text variant="label" className="text-blue-600 dark:text-blue-500">
          Go to home screen
        </Text>
      </Link>
    </View>
  );
}
